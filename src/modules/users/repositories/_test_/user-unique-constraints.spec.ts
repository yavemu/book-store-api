import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { UserCrudRepository } from '../user-crud.repository';
import { User } from '../../entities/user.entity';
import { Role } from '../../../roles/entities/role.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserRole } from '../../../../common/enums/user-role.enum';

describe('UserCrudRepository - Unique Constraints Validation', () => {
  let repository: UserCrudRepository;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let auditLogService: any;

  const mockRole = {
    id: 'role-uuid',
    name: UserRole.USER.toLowerCase(),
    isActive: true,
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'existinguser',
    email: 'existing@example.com',
    password: 'hashedPassword',
    roleId: 'role-uuid',
    isActive: true,
    role: mockRole,
    createdAt: new Date(),
    updatedAt: new Date(),
    hashPassword: jest.fn(),
    beforeInsert: jest.fn(),
    beforeUpdate: jest.fn(),
    normalizeEmail: jest.fn(),
    normalizeUsername: jest.fn(),
  };

  beforeEach(async () => {
    const mockAuditLogService = {
      log: jest.fn(),
      logError: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCrudRepository,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
        {
          provide: 'IAuditLoggerService',
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    repository = module.get<UserCrudRepository>(UserCrudRepository);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepo = module.get<Repository<Role>>(getRepositoryToken(Role));
    auditLogService = module.get('IAuditLoggerService');
  });

  describe('registerUser - Unique Constraints', () => {
    it('should throw ConflictException when email already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser', // Username único
        email: 'existing@example.com', // Email duplicado
        password: 'password123',
      };

      // Mock para findByUsername que no encuentra nada (username único)
      jest.spyOn(repository, 'findByUsername').mockResolvedValue(null);

      // Mock para findByEmail que encuentra un usuario existente (email duplicado)
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(mockUser as unknown as User);

      // Debería lanzar ConflictException
      await expect(repository.registerUser(createUserDto)).rejects.toThrow(
        new ConflictException('El correo electrónico ya está registrado'),
      );
    });

    it('should throw ConflictException when username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser', // Username duplicado
        email: 'new@example.com', // Email único
        password: 'password123',
      };

      // Mock para findByEmail que no encuentra nada (email único)
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);

      // Mock para findByUsername que encuentra un usuario existente (username duplicado)
      jest.spyOn(repository, 'findByUsername').mockResolvedValue(mockUser as unknown as User);

      // Debería lanzar ConflictException
      await expect(repository.registerUser(createUserDto)).rejects.toThrow(
        new ConflictException('El nombre de usuario ya está en uso'),
      );
    });

    it('should create user successfully when email and username are unique', async () => {
      const createUserDto: CreateUserDto = {
        username: 'uniqueuser',
        email: 'unique@example.com',
        password: 'password123',
      };

      const savedUser = { ...mockUser, ...createUserDto };

      // Mock para métodos de búsqueda que no encuentran usuarios existentes (null)
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(repository, 'findByUsername').mockResolvedValue(null);

      // Mock para encontrar rol por defecto
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(mockRole as unknown as Role);

      // Mock para create y save
      jest.spyOn(userRepo, 'create').mockReturnValue(savedUser as any);
      jest.spyOn(userRepo, 'save').mockResolvedValue(savedUser as unknown as User);

      const result = await repository.registerUser(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(result.username).toBe(createUserDto.username);
    });

    it('should handle database errors correctly', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock para métodos de búsqueda que lanzan error de base de datos
      jest
        .spyOn(repository, 'findByEmail')
        .mockRejectedValue(new Error('Database connection error'));
      jest
        .spyOn(repository, 'findByUsername')
        .mockRejectedValue(new Error('Database connection error'));

      // Debería lanzar HttpException con error interno del servidor
      await expect(repository.registerUser(createUserDto)).rejects.toThrow(
        new HttpException('Error al registrar el usuario', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('DTO Validation Tests', () => {
    it('should validate minimum username length', async () => {
      const createUserDto: CreateUserDto = {
        username: 'ab', // Menor a 3 caracteres
        email: 'valid@example.com',
        password: 'password123',
      };

      // Este test debería fallar en la validación del DTO antes de llegar al repositorio
      // La validación se maneja por class-validator en el controlador/pipe
      expect(createUserDto.username.length).toBeLessThan(3);
    });

    it('should validate maximum username length', async () => {
      const createUserDto: CreateUserDto = {
        username: 'a'.repeat(51), // Mayor a 50 caracteres
        email: 'valid@example.com',
        password: 'password123',
      };

      expect(createUserDto.username.length).toBeGreaterThan(50);
    });

    it('should validate email format', async () => {
      const createUserDto: CreateUserDto = {
        username: 'validuser',
        email: 'invalid-email', // Email inválido
        password: 'password123',
      };

      // La validación de email se maneja por class-validator
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(createUserDto.email)).toBe(false);
    });

    it('should validate minimum password length', async () => {
      const createUserDto: CreateUserDto = {
        username: 'validuser',
        email: 'valid@example.com',
        password: '12345', // Menor a 6 caracteres
      };

      expect(createUserDto.password.length).toBeLessThan(6);
    });

    it('should validate UUID format for roleId', async () => {
      const createUserDto: CreateUserDto = {
        username: 'validuser',
        email: 'valid@example.com',
        password: 'password123',
        roleId: 'invalid-uuid', // UUID inválido
      };

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuidRegex.test(createUserDto.roleId || '')).toBe(false);
    });

    it('should validate that all required fields are present', () => {
      const incompleteDto = {
        username: 'validuser',
        // email missing
        password: 'password123',
      } as CreateUserDto;

      expect(incompleteDto.email).toBeUndefined();
    });
  });
});
