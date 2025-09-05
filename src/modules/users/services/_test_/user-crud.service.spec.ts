import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { UserCrudService } from '../user-crud.service';
import { IUserCrudRepository } from '../../interfaces/user-crud.repository.interface';
import { CreateUserDto } from '../../dto/create-user.dto';
import { RegisterUserDto } from '../../dto/register-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { PaginationDto, PaginatedResult } from '../../../../common/dto/pagination.dto';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../../../common/enums/user-role.enum';

// Helper function to create PaginationDto
function createPaginationDto(overrides: Partial<PaginationDto> = {}): PaginationDto {
  const dto = new PaginationDto();
  Object.assign(dto, {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC' as const,
    ...overrides,
  });
  return dto;
}

describe('UserCrudService', () => {
  let service: UserCrudService;
  let repository: jest.Mocked<IUserCrudRepository>;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'testuser',
    email: 'test@example.com',
    password: '$2b$10$hashedpassword',
    firstName: 'Test',
    lastName: 'User',
    roleId: 'role-123',
    role: {
      id: 'role-123',
      name: UserRole.USER,
      description: 'User role',
      isActive: true,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      normalizeRoleName: jest.fn(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    hashPassword: jest.fn(),
    normalizeEmail: jest.fn(),
    normalizeUsername: jest.fn(),
  };

  const mockPaginatedResult: PaginatedResult<User> = {
    data: [mockUser],
    meta: {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };

  beforeEach(async () => {
    const mockUsers = [
      mockUser,
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        username: 'testuser2',
        email: 'test2@example.com',
        password: '$2b$10$hashedpassword2',
        firstName: 'Test2',
        lastName: 'User2',
        roleId: 'role-456',
        role: {
          id: 'role-456',
          name: 'admin',
          description: 'Administrator role',
          isActive: true,
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          normalizeRoleName: jest.fn(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        hashPassword: jest.fn(),
        normalizeEmail: jest.fn(),
        normalizeUsername: jest.fn(),
      },
    ];

    const mockRepository: jest.Mocked<IUserCrudRepository> = {
      registerUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
      deactivateUser: jest.fn(),
      findForSelect: jest.fn().mockResolvedValue(mockUsers),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCrudService,
        {
          provide: 'IUserCrudRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserCrudService>(UserCrudService);
    repository = module.get('IUserCrudRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      roleId: 'role-123',
    };

    it('should create a user successfully', async () => {
      repository.registerUser.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto, 'creator-id');

      expect(result).toEqual(mockUser);
      expect(repository.registerUser).toHaveBeenCalledWith(createUserDto, 'creator-id');
      expect(repository.registerUser).toHaveBeenCalledTimes(1);
    });

    it('should create a user without createdBy parameter', async () => {
      repository.registerUser.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(repository.registerUser).toHaveBeenCalledWith(createUserDto, undefined);
      expect(repository.registerUser).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      repository.registerUser.mockRejectedValue(error);

      await expect(service.create(createUserDto)).rejects.toThrow('Database error');
      expect(repository.registerUser).toHaveBeenCalledWith(createUserDto, undefined);
    });
  });

  describe('register', () => {
    const registerUserDto: RegisterUserDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      roleId: 'role-123',
    };

    it('should register a user successfully', async () => {
      repository.registerUser.mockResolvedValue(mockUser);

      const result = await service.register(registerUserDto, 'creator-id');

      expect(result).toEqual(mockUser);
      expect(repository.registerUser).toHaveBeenCalledWith(registerUserDto, 'creator-id');
      expect(repository.registerUser).toHaveBeenCalledTimes(1);
    });

    it('should register a user without createdBy parameter', async () => {
      repository.registerUser.mockResolvedValue(mockUser);

      const result = await service.register(registerUserDto);

      expect(result).toEqual(mockUser);
      expect(repository.registerUser).toHaveBeenCalledWith(registerUserDto, undefined);
      expect(repository.registerUser).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors during registration', async () => {
      const error = new Error('Registration failed');
      repository.registerUser.mockRejectedValue(error);

      await expect(service.register(registerUserDto)).rejects.toThrow('Registration failed');
      expect(repository.registerUser).toHaveBeenCalledWith(registerUserDto, undefined);
    });
  });

  describe('findAll', () => {
    const paginationDto = createPaginationDto();

    it('should return paginated users', async () => {
      repository.getAllUsers.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(repository.getAllUsers).toHaveBeenCalledWith(paginationDto);
      expect(repository.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors when finding all users', async () => {
      const error = new Error('Database connection failed');
      repository.getAllUsers.mockRejectedValue(error);

      await expect(service.findAll(paginationDto)).rejects.toThrow('Database connection failed');
      expect(repository.getAllUsers).toHaveBeenCalledWith(paginationDto);
    });
  });

  describe('findById', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return user when no role restrictions apply', async () => {
      repository.getUserProfile.mockResolvedValue(mockUser);

      const result = await service.findById(userId);

      expect(result).toEqual(mockUser);
      expect(repository.getUserProfile).toHaveBeenCalledWith(userId);
      expect(repository.getUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should return user when admin role is requesting', async () => {
      repository.getUserProfile.mockResolvedValue(mockUser);

      const result = await service.findById(userId, 'admin-id', UserRole.ADMIN);

      expect(result).toEqual(mockUser);
      expect(repository.getUserProfile).toHaveBeenCalledWith(userId);
      expect(repository.getUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should return user when user requests their own profile', async () => {
      repository.getUserProfile.mockResolvedValue(mockUser);

      const result = await service.findById(userId, userId, UserRole.USER);

      expect(result).toEqual(mockUser);
      expect(repository.getUserProfile).toHaveBeenCalledWith(userId);
      expect(repository.getUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenException when regular user tries to access another user profile', async () => {
      const requestingUserId = 'different-user-id';

      await expect(service.findById(userId, requestingUserId, UserRole.USER)).rejects.toThrow(
        ForbiddenException,
      );

      await expect(service.findById(userId, requestingUserId, UserRole.USER)).rejects.toThrow(
        'Solo puedes acceder a tu propio perfil',
      );

      expect(repository.getUserProfile).not.toHaveBeenCalled();
    });

    it('should handle repository errors when finding user by id', async () => {
      const error = new Error('User not found');
      repository.getUserProfile.mockRejectedValue(error);

      await expect(service.findById(userId)).rejects.toThrow('User not found');
      expect(repository.getUserProfile).toHaveBeenCalledWith(userId);
    });
  });

  describe('update', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const updateUserDto: UpdateUserDto = {
      username: 'updateduser',
      email: 'updated@example.com',
    };

    it('should update user when no role restrictions apply', async () => {
      repository.updateUserProfile.mockResolvedValue(mockUser);

      const result = await service.update(userId, updateUserDto, 'updater-id');

      expect(result).toEqual(mockUser);
      expect(repository.updateUserProfile).toHaveBeenCalledWith(
        userId,
        updateUserDto,
        'updater-id',
      );
      expect(repository.updateUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should update user when admin role is updating', async () => {
      repository.updateUserProfile.mockResolvedValue(mockUser);

      const result = await service.update(
        userId,
        updateUserDto,
        'updater-id',
        'admin-id',
        UserRole.ADMIN,
      );

      expect(result).toEqual(mockUser);
      expect(repository.updateUserProfile).toHaveBeenCalledWith(
        userId,
        updateUserDto,
        'updater-id',
      );
      expect(repository.updateUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should update user when user updates their own profile', async () => {
      repository.updateUserProfile.mockResolvedValue(mockUser);

      const result = await service.update(
        userId,
        updateUserDto,
        'updater-id',
        userId,
        UserRole.USER,
      );

      expect(result).toEqual(mockUser);
      expect(repository.updateUserProfile).toHaveBeenCalledWith(
        userId,
        updateUserDto,
        'updater-id',
      );
      expect(repository.updateUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenException when regular user tries to update another user', async () => {
      const requestingUserId = 'different-user-id';

      await expect(
        service.update(userId, updateUserDto, 'updater-id', requestingUserId, UserRole.USER),
      ).rejects.toThrow(ForbiddenException);

      await expect(
        service.update(userId, updateUserDto, 'updater-id', requestingUserId, UserRole.USER),
      ).rejects.toThrow('Solo puedes actualizar tu propio perfil');

      expect(repository.updateUserProfile).not.toHaveBeenCalled();
    });

    it('should update user without optional parameters', async () => {
      repository.updateUserProfile.mockResolvedValue(mockUser);

      const result = await service.update(userId, updateUserDto);

      expect(result).toEqual(mockUser);
      expect(repository.updateUserProfile).toHaveBeenCalledWith(userId, updateUserDto, undefined);
      expect(repository.updateUserProfile).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors during update', async () => {
      const error = new Error('Update failed');
      repository.updateUserProfile.mockRejectedValue(error);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow('Update failed');
      expect(repository.updateUserProfile).toHaveBeenCalledWith(userId, updateUserDto, undefined);
    });
  });

  describe('softDelete', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const expectedResult = { id: userId };

    it('should soft delete user successfully', async () => {
      repository.deactivateUser.mockResolvedValue(expectedResult);

      const result = await service.softDelete(userId, 'deleter-id');

      expect(result).toEqual(expectedResult);
      expect(repository.deactivateUser).toHaveBeenCalledWith(userId, 'deleter-id');
      expect(repository.deactivateUser).toHaveBeenCalledTimes(1);
    });

    it('should soft delete user without deletedBy parameter', async () => {
      repository.deactivateUser.mockResolvedValue(expectedResult);

      const result = await service.softDelete(userId);

      expect(result).toEqual(expectedResult);
      expect(repository.deactivateUser).toHaveBeenCalledWith(userId, undefined);
      expect(repository.deactivateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors during soft delete', async () => {
      const error = new Error('Delete failed');
      repository.deactivateUser.mockRejectedValue(error);

      await expect(service.softDelete(userId)).rejects.toThrow('Delete failed');
      expect(repository.deactivateUser).toHaveBeenCalledWith(userId, undefined);
    });
  });
});
