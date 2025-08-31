import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCrudRepository } from '../user-crud.repository';
import { User } from '../../entities/user.entity';
import { Role } from '../../../roles/entities/role.entity';
import { CreateUserDto, UpdateUserDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { HttpException, HttpStatus, NotFoundException, ConflictException } from '@nestjs/common';
import { IAuditLoggerService } from '../../../audit/interfaces/audit-logger.service.interface';
import { UserRole } from '../../../../common/enums/user-role.enum';

const mockUser: Partial<User> = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  password: '$2b$10$hashedpassword',
  roleId: 'role-1',
  role: {
    id: 'role-1',
    name: UserRole.USER,
    description: 'Regular user role',
    permissions: [],
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as any,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockRole = {
  id: 'role-1',
  name: UserRole.USER,
  description: 'Regular user role',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as any;

describe('UserCrudRepository', () => {
  let repository: UserCrudRepository;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let auditLoggerService: IAuditLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCrudRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(mockUser as User),
            save: jest.fn().mockResolvedValue(mockUser as User),
            findOne: jest.fn().mockResolvedValue(mockUser as User),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
            findAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
            count: jest.fn().mockResolvedValue(0),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockRole),
          },
        },
        {
          provide: 'IAuditLoggerService',
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserCrudRepository>(UserCrudRepository);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepo = module.get<Repository<Role>>(getRepositoryToken(Role));
    auditLoggerService = module.get<IAuditLoggerService>('IAuditLoggerService');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a user successfully', async () => {
      const createDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      } as CreateUserDto;

      (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);

      const result = await repository.registerUser(createDto, 'test-user');

      expect((repository as any)._validateUniqueConstraints).toHaveBeenCalled();
      expect(userRepo.create).toHaveBeenCalled();
      expect(userRepo.save).toHaveBeenCalled();
      expect(auditLoggerService.log).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should assign default role when roleId not provided', async () => {
      const createDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      } as CreateUserDto;

      (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);

      await repository.registerUser(createDto, 'test-user');

      expect(roleRepo.findOne).toHaveBeenCalledWith({
        where: { name: UserRole.USER.toLowerCase(), isActive: true },
      });
      expect(createDto.roleId).toBe('role-1');
    });

    it('should throw error if validation fails', async () => {
      const createDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      } as CreateUserDto;

      (repository as any)._validateUniqueConstraints = jest
        .fn()
        .mockRejectedValue(new Error('Username already exists'));

      await expect(repository.registerUser(createDto, 'test-user')).rejects.toThrow(HttpException);
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      (repository as any)._findById = jest.fn().mockResolvedValue(mockUser as User);

      const result = await repository.getUserProfile('1');

      expect((repository as any)._findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      (repository as any)._findById = jest.fn().mockResolvedValue(null);

      await expect(repository.getUserProfile('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const updateDto: UpdateUserDto = { username: 'updateduser' };
      const updatedUser = { ...mockUser, ...updateDto };

      jest.spyOn(repository, 'getUserProfile').mockResolvedValue(mockUser as User);
      (repository as any)._findOne = jest.fn().mockResolvedValue(null);
      (repository as any)._update = jest.fn().mockResolvedValue(updatedUser);

      const result = await repository.updateUserProfile('1', updateDto, 'test-user');

      expect(repository.getUserProfile).toHaveBeenCalledWith('1');
      expect((repository as any)._findOne).toHaveBeenCalled();
      expect((repository as any)._update).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should throw ConflictException when username already exists', async () => {
      const updateDto: UpdateUserDto = { username: 'existinguser' };
      const existingUser = { ...mockUser, id: '2', username: 'existinguser' };

      jest.spyOn(repository, 'getUserProfile').mockResolvedValue(mockUser as User);
      (repository as any)._findOne = jest.fn().mockResolvedValue(existingUser);

      await expect(repository.updateUserProfile('1', updateDto, 'test-user')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException when email already exists', async () => {
      const updateDto: UpdateUserDto = { email: 'existing@example.com' };
      const existingUser = { ...mockUser, id: '2', email: 'existing@example.com' };

      jest.spyOn(repository, 'getUserProfile').mockResolvedValue(mockUser as User);
      (repository as any)._findOne = jest.fn().mockResolvedValue(existingUser);

      await expect(repository.updateUserProfile('1', updateDto, 'test-user')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      const deleteResult = { id: '1' };

      jest.spyOn(repository, 'getUserProfile').mockResolvedValue(mockUser as User);
      (repository as any)._softDelete = jest.fn().mockResolvedValue(deleteResult);

      const result = await repository.deactivateUser('1', 'test-user');

      expect(repository.getUserProfile).toHaveBeenCalledWith('1');
      expect((repository as any)._softDelete).toHaveBeenCalledWith(
        '1',
        'test-user',
        'User',
        expect.any(Function),
      );
      expect(result).toEqual(deleteResult);
    });
  });

  describe('getAllUsers', () => {
    it('should get all users with pagination', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockUser], meta: { total: 1, page: 1, limit: 10 } };

      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.getAllUsers(pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('validation methods', () => {
    describe('findByEmail', () => {
      it('should find user by email', async () => {
        (repository as any)._findOne = jest.fn().mockResolvedValue(mockUser as User);

        const result = await repository.findByEmail('test@example.com');

        expect((repository as any)._findOne).toHaveBeenCalledWith({
          where: { email: 'test@example.com' },
        });
        expect(result).toEqual(mockUser);
      });
    });

    describe('findByUsername', () => {
      it('should find user by username', async () => {
        (repository as any)._findOne = jest.fn().mockResolvedValue(mockUser as User);

        const result = await repository.findByUsername('testuser');

        expect((repository as any)._findOne).toHaveBeenCalledWith({
          where: { username: 'testuser' },
        });
        expect(result).toEqual(mockUser);
      });
    });
  });

  describe('_validateUniqueConstraints', () => {
    it('should pass validation when no conflicts', async () => {
      const dto = { username: 'newuser', email: 'new@example.com' };
      const constraints = [
        {
          field: 'username',
          message: 'Username exists',
          transform: (v: string) => v.toLowerCase(),
        },
        { field: 'email', message: 'Email exists', transform: (v: string) => v.toLowerCase() },
      ];

      jest.spyOn(repository, 'findByUsername').mockResolvedValue(null);
      jest.spyOn(repository, 'findByEmail').mockResolvedValue(null);

      await expect(
        (repository as any)._validateUniqueConstraints(dto, undefined, constraints),
      ).resolves.not.toThrow();
    });

    it('should throw error when username conflict found', async () => {
      const dto = { username: 'existinguser' };
      const constraints = [
        {
          field: 'username',
          message: 'Username exists',
          transform: (v: string) => v.toLowerCase(),
        },
      ];

      jest.spyOn(repository, 'findByUsername').mockResolvedValue(mockUser as User);

      await expect(
        (repository as any)._validateUniqueConstraints(dto, undefined, constraints),
      ).rejects.toThrow('Username exists');
    });
  });
});
