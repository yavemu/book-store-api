import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCrudRepository } from '../user-crud.repository';
import { User } from '../../entities/user.entity';
import { Role } from '../../../roles/entities/role.entity';
import { IAuditLoggerService } from '../../../audit/interfaces/audit-logger.service.interface';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { UserFactory, RoleFactory, PaginationFactory } from '../../../../common/test-factories';
import { NotFoundException, ConflictException, HttpException } from '@nestjs/common';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { AuditAction } from '../../../audit/enums/audit-action.enum';

describe('UserCrudRepository', () => {
  let repository: UserCrudRepository;
  let mockUserRepository: jest.Mocked<Repository<User>>;
  let mockRoleRepository: jest.Mocked<Repository<Role>>;
  let mockAuditLogService: jest.Mocked<IAuditLoggerService>;
  let userFactory: UserFactory;
  let roleFactory: RoleFactory;
  let paginationFactory: PaginationFactory;

  beforeEach(async () => {
    userFactory = new UserFactory();
    roleFactory = new RoleFactory();
    paginationFactory = new PaginationFactory();

    mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      count: jest.fn(),
      softDelete: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      })),
    } as any;

    mockRoleRepository = {
      findOne: jest.fn(),
    } as any;

    mockAuditLogService = {
      log: jest.fn(),
      logAction: jest.fn().mockResolvedValue(undefined),
      logEnhanced: jest.fn().mockResolvedValue(undefined),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCrudRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: 'IAuditLoggerService',
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    repository = module.get<UserCrudRepository>(UserCrudRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('registerUser()', () => {
    it('should register a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        roleId: undefined,
      };

      const mockUser = userFactory.create(createUserDto);
      const mockRole = roleFactory.createUser();

      mockUserRepository.findOne.mockResolvedValue(null);
      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      mockUserRepository.create.mockReturnValue(mockUser as any);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockAuditLogService.log.mockResolvedValue(undefined);

      const result = await repository.registerUser(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2); // username and email validation
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({
        where: { name: UserRole.USER.toLowerCase(), isActive: true },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createUserDto,
          roleId: mockRole.id,
        }),
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockAuditLogService.log).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.id,
        AuditAction.REGISTER,
        expect.stringContaining('User registered'),
        'User',
      );
    });

    it('should register user with existing roleId', async () => {
      const roleId = 'existing-role-id';
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        roleId,
      };

      const mockUser = userFactory.create(createUserDto);

      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser as any);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockAuditLogService.log.mockResolvedValue(undefined);

      const result = await repository.registerUser(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockRoleRepository.findOne).not.toHaveBeenCalled();
      expect(createUserDto.roleId).toBe(roleId);
    });

    it('should register user initiated by admin (CREATE action)', async () => {
      const performedBy = 'admin-id';
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = userFactory.create(createUserDto);
      const mockRole = roleFactory.createUser();

      mockUserRepository.findOne.mockResolvedValue(null);
      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      mockUserRepository.create.mockReturnValue(mockUser as any);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockAuditLogService.log.mockResolvedValue(undefined);

      const result = await repository.registerUser(createUserDto, performedBy);

      expect(result).toEqual(mockUser);
      expect(mockAuditLogService.log).toHaveBeenCalledWith(
        performedBy,
        mockUser.id,
        AuditAction.CREATE,
        expect.stringContaining('User registered'),
        'User',
      );
    });

    it('should throw ConflictException when username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        email: 'test@example.com',
        password: 'password123',
      };

      const existingUser = userFactory.create({ username: 'existinguser' });

      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser) // username check
        .mockResolvedValueOnce(null); // email check

      await expect(repository.registerUser(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when email already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
      };

      const existingUser = userFactory.create({ email: 'existing@example.com' });

      mockUserRepository.findOne
        .mockResolvedValueOnce(null) // username check
        .mockResolvedValueOnce(existingUser); // email check

      await expect(repository.registerUser(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should handle repository save errors', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockRole = roleFactory.createUser();

      mockUserRepository.findOne.mockResolvedValue(null);
      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      mockUserRepository.create.mockReturnValue({} as any);
      mockUserRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(repository.registerUser(createUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('getUserProfile()', () => {
    it('should return user profile successfully', async () => {
      const userId = 'user-id';
      const mockUser = userFactory.create({ id: userId });

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.getUserProfile(userId);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent-user';

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(repository.getUserProfile(userId)).rejects.toThrow(NotFoundException);
    });

    it('should handle repository errors', async () => {
      const userId = 'user-id';

      mockUserRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(repository.getUserProfile(userId)).rejects.toThrow(HttpException);
    });
  });

  describe('updateUserProfile()', () => {
    it('should update user profile successfully', async () => {
      const userId = 'user-id';
      const updateDto: UpdateUserDto = {
        username: 'updateduser',
      };

      const existingUser = userFactory.create({ id: userId, username: 'olduser' });
      const updatedUser = userFactory.create({ ...existingUser, ...updateDto });

      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser) // getUserProfile
        .mockResolvedValueOnce(null) // username uniqueness check - no conflict
        .mockResolvedValueOnce(updatedUser); // _findById after update

      mockUserRepository.update.mockResolvedValue(undefined);
      mockAuditLogService.logEnhanced.mockResolvedValue(undefined);

      const result = await repository.updateUserProfile(userId, updateDto);

      expect(result).toEqual(updatedUser);
      // Without performedBy, no audit log should be called
    });

    it('should update user profile with performedBy parameter', async () => {
      const userId = 'user-id';
      const performedBy = 'admin-id';
      const updateDto: UpdateUserDto = {
        username: 'updated',
      };

      const existingUser = userFactory.create({ id: userId, username: 'olduser' });
      const updatedUser = userFactory.create({ ...existingUser, ...updateDto });

      // Reset all previous mocks
      mockUserRepository.findOne.mockReset();
      let callCount = 0;
      mockUserRepository.findOne.mockImplementation((query: any) => {
        callCount++;
        // First call - getUserProfile returns existing user
        if (callCount === 1 && query.where.id === userId) {
          return Promise.resolve(existingUser);
        }
        // Second call - username uniqueness check
        if (query.where.username) {
          return Promise.resolve(null); // No conflict
        }
        // Third call - _findById after update returns updated user
        if (query.where.id === userId) {
          return Promise.resolve(updatedUser);
        }
        return Promise.resolve(updatedUser);
      });

      mockUserRepository.update.mockResolvedValue(undefined);
      mockAuditLogService.logEnhanced.mockResolvedValue(undefined);

      const result = await repository.updateUserProfile(userId, updateDto, performedBy);

      expect(result).toEqual(updatedUser);
      expect(mockAuditLogService.logEnhanced).toHaveBeenCalledWith(
        expect.objectContaining({
          action: AuditAction.UPDATE,
          entityId: userId,
          entityType: 'User',
          performedBy: performedBy,
        }),
      );
    });

    it('should throw ConflictException when updating to existing username', async () => {
      const userId = 'user-id';
      const updateDto: UpdateUserDto = {
        username: 'existinguser',
      };

      const existingUser = userFactory.create({ id: userId, username: 'currentuser' });
      const conflictingUser = userFactory.create({ username: 'existinguser' });

      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser) // getUserProfile
        .mockResolvedValueOnce(conflictingUser); // username check

      await expect(repository.updateUserProfile(userId, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException when updating to existing email', async () => {
      const userId = 'user-id';
      const updateDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      const existingUser = userFactory.create({ id: userId, email: 'current@example.com' });
      const conflictingUser = userFactory.create({ email: 'existing@example.com' });

      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser) // getUserProfile
        .mockResolvedValueOnce(conflictingUser); // email check - conflict found!

      await expect(repository.updateUserProfile(userId, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should allow updating to same username', async () => {
      const userId = 'user-id';
      const updateDto: UpdateUserDto = {
        username: 'currentuser',
        password: 'newpassword123',
      };

      const existingUser = userFactory.create({ id: userId, username: 'currentuser' });
      const updatedUser = userFactory.create({ ...existingUser, ...updateDto });

      mockUserRepository.findOne
        .mockResolvedValueOnce(existingUser) // getUserProfile
        .mockResolvedValueOnce(updatedUser) // _update internal call
        .mockResolvedValueOnce(updatedUser); // _update return

      mockUserRepository.save.mockResolvedValue(updatedUser);
      mockAuditLogService.log.mockResolvedValue(undefined);

      const result = await repository.updateUserProfile(userId, updateDto);

      expect(result).toEqual(updatedUser);
      // Should not check for username conflicts when username hasn't changed
    });
  });

  describe('deactivateUser()', () => {
    it('should deactivate user successfully', async () => {
      const userId = 'user-id';
      const mockUser = userFactory.create({ id: userId });

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.softDelete.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      const result = await repository.deactivateUser(userId);

      expect(result).toEqual({ id: userId });
      expect(mockUserRepository.softDelete).toHaveBeenCalledWith({ id: userId });
      // Without performedBy, no audit log should be called
    });

    it('should deactivate user with performedBy parameter', async () => {
      const userId = 'user-id';
      const performedBy = 'admin-id';
      const mockUser = userFactory.create({ id: userId });

      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.softDelete.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });
      mockAuditLogService.logEnhanced.mockResolvedValue(undefined);

      const result = await repository.deactivateUser(userId, performedBy);

      expect(result).toEqual({ id: userId });
      expect(mockAuditLogService.logEnhanced).toHaveBeenCalledWith(
        expect.objectContaining({
          action: AuditAction.DELETE,
          entityId: userId,
          entityType: 'User',
          performedBy: performedBy,
        }),
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 'non-existent-user';

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(repository.deactivateUser(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUsers()', () => {
    it('should return paginated users successfully', async () => {
      const pagination = paginationFactory.create();
      const mockUsers = userFactory.createMany(5);
      const total = 15;

      mockUserRepository.findAndCount.mockResolvedValue([mockUsers, total]);

      const result = await repository.getAllUsers(pagination);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(total);
      expect(result.meta.page).toBe(pagination.page);
      expect(result.meta.limit).toBe(pagination.limit);
    });

    it('should handle empty results', async () => {
      const pagination = paginationFactory.create();

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await repository.getAllUsers(pagination);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should handle repository errors', async () => {
      const pagination = paginationFactory.create();

      mockUserRepository.findAndCount.mockRejectedValue(new Error('Database error'));

      await expect(repository.getAllUsers(pagination)).rejects.toThrow(HttpException);
    });
  });

  describe('Validation methods', () => {
    describe('findByEmail()', () => {
      it('should find user by email', async () => {
        const email = 'Test@Example.Com'; // Mixed case
        const mockUser = userFactory.create({ email: email.toLowerCase() });

        mockUserRepository.findOne.mockResolvedValue(mockUser);

        const result = await repository.findByEmail(email);

        expect(result).toEqual(mockUser);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          where: { email: 'test@example.com' },
        });
      });

      it('should return null when user not found', async () => {
        mockUserRepository.findOne.mockResolvedValue(null);

        const result = await repository.findByEmail('nonexistent@example.com');

        expect(result).toBeNull();
      });
    });

    describe('findByEmailExcludingId()', () => {
      it('should find user by email excluding specific ID', async () => {
        const email = 'test@example.com';
        const excludeId = 'exclude-id';
        const mockUser = userFactory.create({ email });

        mockUserRepository.findOne.mockResolvedValue(mockUser);

        const result = await repository.findByEmailExcludingId(email, excludeId);

        expect(result).toEqual(mockUser);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          where: {
            email: 'test@example.com',
            id: { not: excludeId },
          },
        });
      });
    });

    describe('findByUsername()', () => {
      it('should find user by username', async () => {
        const username = 'TestUser'; // Mixed case
        const mockUser = userFactory.create({ username: username.toLowerCase() });

        mockUserRepository.findOne.mockResolvedValue(mockUser);

        const result = await repository.findByUsername(username);

        expect(result).toEqual(mockUser);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          where: { username: 'testuser' },
        });
      });
    });

    describe('findByUsernameExcludingId()', () => {
      it('should find user by username excluding specific ID', async () => {
        const username = 'testuser';
        const excludeId = 'exclude-id';
        const mockUser = userFactory.create({ username });

        mockUserRepository.findOne.mockResolvedValue(mockUser);

        const result = await repository.findByUsernameExcludingId(username, excludeId);

        expect(result).toEqual(mockUser);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({
          where: {
            username: 'testuser',
            id: { not: excludeId },
          },
        });
      });
    });
  });

  describe('_validateUniqueConstraints()', () => {
    it('should pass validation when no constraints provided', async () => {
      const dto = { username: 'test' };

      await expect(repository._validateUniqueConstraints(dto)).resolves.not.toThrow();
    });

    it('should pass validation when no existing conflicts', async () => {
      const dto = { username: 'newuser', email: 'new@example.com' };
      const constraints = [
        { field: 'username', message: 'Username exists' },
        { field: 'email', message: 'Email exists' },
      ];

      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        repository._validateUniqueConstraints(dto, undefined, constraints),
      ).resolves.not.toThrow();
    });

    it('should throw ConflictException when username exists', async () => {
      const dto = { username: 'existinguser' };
      const constraints = [{ field: 'username', message: 'Username already exists' }];

      mockUserRepository.findOne.mockResolvedValue(userFactory.create());

      await expect(
        repository._validateUniqueConstraints(dto, undefined, constraints),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when email exists', async () => {
      const dto = { email: 'existing@example.com' };
      const constraints = [{ field: 'email', message: 'Email already exists' }];

      mockUserRepository.findOne.mockResolvedValue(userFactory.create());

      await expect(
        repository._validateUniqueConstraints(dto, undefined, constraints),
      ).rejects.toThrow(ConflictException);
    });

    it('should use transform function when provided', async () => {
      const dto = { username: 'NewUser' }; // Mixed case
      const constraints = [
        {
          field: 'username',
          message: 'Username exists',
          transform: (value: string) => value.toLowerCase(),
        },
      ];

      mockUserRepository.findOne.mockResolvedValue(null);

      await repository._validateUniqueConstraints(dto, undefined, constraints);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { username: 'newuser' },
      });
    });

    it('should validate for updates by excluding current entity ID', async () => {
      const dto = { username: 'testuser' };
      const entityId = 'current-id';
      const constraints = [{ field: 'username', message: 'Username exists' }];

      mockUserRepository.findOne.mockResolvedValue(null);

      await repository._validateUniqueConstraints(dto, entityId, constraints);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: {
          username: 'testuser',
          id: { not: entityId },
        },
      });
    });

    it('should skip validation when field value is empty', async () => {
      const dto = { username: '', email: null };
      const constraints = [
        { field: 'username', message: 'Username exists' },
        { field: 'email', message: 'Email exists' },
      ];

      await repository._validateUniqueConstraints(dto, undefined, constraints);

      expect(mockUserRepository.findOne).not.toHaveBeenCalled();
    });
  });
});
