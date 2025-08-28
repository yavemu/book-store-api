import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../user.repository';
import { User } from '../../entities/user.entity';
import { Role } from '../../../roles/entities/role.entity';
import { CreateUserDto, UpdateUserDto } from '../../dto';
import { UserRole } from '../../enums/user-role.enum';
import { ConflictException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '../../../../common/dto';

const mockRole: Role = {
    id: '1',
    name: 'user',
    description: 'user role',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    users: [],
    normalizeRoleName: jest.fn(),
  };

  const mockUser: User = {
    id: '1',
    username: 'test',
    password: 'hashedpassword',
    email: 'test@test.com',
    roleId: '1',
    role: mockRole,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    hashPassword: jest.fn(),
    normalizeEmail: jest.fn(),
    normalizeUsername: jest.fn(),
  };

describe('UserRepository', () => {
  let repository: UserRepository;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;

  const mockUserRepo = {
    findOne: jest.fn(),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    softDelete: jest.fn(),
    update: jest.fn(),
    findAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
    count: jest.fn(),
  };

  const mockRoleRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepo,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepo = module.get<Repository<Role>>(getRepositoryToken(Role));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a user with default role', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockRoleRepo.findOne.mockResolvedValue(mockRole);
      const createUserDto: CreateUserDto = { username: 'newuser', email: 'new@test.com', password: 'password', roleId: '1' };
      const result = await repository.registerUser(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw conflict exception if username exists', async () => {
        (repository as any)._validateUniqueConstraints = jest.fn().mockRejectedValue(new ConflictException());
        const createUserDto: CreateUserDto = { username: 'test', email: 'new@test.com', password: 'password' };
        await expect(repository.registerUser(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should throw http exception for other errors', async () => {
        (repository as any)._validateUniqueConstraints = jest.fn().mockRejectedValue(new Error());
        const createUserDto: CreateUserDto = { username: 'test', email: 'new@test.com', password: 'password' };
        await expect(repository.registerUser(createUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('authenticateUser', () => {
    it('should return a user for authentication', async () => {
        mockUserRepo.findOne.mockResolvedValue(mockUser);
        const result = await repository.authenticateUser('test@test.com');
        expect(result).toEqual(mockUser);
    });

    it('should throw http exception on error', async () => {
        mockUserRepo.findOne.mockRejectedValue(new Error());
        await expect(repository.authenticateUser('test@test.com')).rejects.toThrow(HttpException);
    });
  })

  describe('getUserProfile', () => {
    it('should return a user profile', async () => {
        (repository as any)._findById = jest.fn().mockResolvedValue(mockUser);
        const result = await repository.getUserProfile('1');
        expect(result).toEqual(mockUser);
    });

    it('should throw not found exception if user does not exist', async () => {
        (repository as any)._findById = jest.fn().mockResolvedValue(null);
        await expect(repository.getUserProfile('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw http exception on error', async () => {
        (repository as any)._findById = jest.fn().mockRejectedValue(new Error());
        await expect(repository.getUserProfile('1')).rejects.toThrow(HttpException);
    });
  })

  describe('updateUserProfile', () => {
      it('should update a user profile', async () => {
          const updateUserDto: UpdateUserDto = { username: 'updated' };
          (repository as any).getUserProfile = jest.fn().mockResolvedValue(mockUser);
          (repository as any)._findOne = jest.fn().mockResolvedValue(null);
          (repository as any)._updateEntity = jest.fn();
          (repository as any)._findById = jest.fn().mockResolvedValue({...mockUser, ...updateUserDto});

          const result = await repository.updateUserProfile('1', updateUserDto);
          expect(result.username).toEqual('updated');
      });

      it('should throw conflict if username exists', async () => {
        const updateUserDto: UpdateUserDto = { username: 'existing' };
        (repository as any).getUserProfile = jest.fn().mockResolvedValue(mockUser);
        (repository as any)._findOne = jest.fn().mockResolvedValue({id: '2', username: 'existing'});
        await expect(repository.updateUserProfile('1', updateUserDto)).rejects.toThrow(ConflictException);
      });

      it('should throw http exception on error', async () => {
        const updateUserDto: UpdateUserDto = { username: 'updated' };
        (repository as any).getUserProfile = jest.fn().mockRejectedValue(new Error());
        await expect(repository.updateUserProfile('1', updateUserDto)).rejects.toThrow(HttpException);
      });
  });

  describe('deactivateUser', () => {
      it('should deactivate a user', async () => {
        (repository as any).getUserProfile = jest.fn().mockResolvedValue(mockUser);
        (repository as any)._softDelete = jest.fn();
        await repository.deactivateUser('1');
        expect((repository as any)._softDelete).toHaveBeenCalled();
      });

      it('should throw http exception on error', async () => {
        (repository as any).getUserProfile = jest.fn().mockRejectedValue(new Error());
        await expect(repository.deactivateUser('1')).rejects.toThrow(HttpException);
      });
  });

  describe('searchUsers', () => {
      it('should search users', async () => {
        const pagination = new PaginationDto();
        (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[mockUser], 1]);
        const result = await repository.searchUsers('test', pagination);
        expect(result[0]).toEqual([mockUser]);
      });

      it('should throw http exception on error', async () => {
        const pagination = new PaginationDto();
        (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
        await expect(repository.searchUsers('test', pagination)).rejects.toThrow(HttpException);
      });
  });

  describe('getAllUsers', () => {
    it('should get all users', async () => {
      const pagination = new PaginationDto();
      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[mockUser], 1]);
      const result = await repository.getAllUsers(pagination);
      expect(result[0]).toEqual([mockUser]);
    });

    it('should throw http exception on error', async () => {
        const pagination = new PaginationDto();
        (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
        await expect(repository.getAllUsers(pagination)).rejects.toThrow(HttpException);
      });
  });

  describe('checkUsernameExists', () => {
    it('should check if username exists', async () => {
        (repository as any)._exists = jest.fn().mockResolvedValue(true);
        const result = await repository.checkUsernameExists('test');
        expect(result).toBe(true);
    });

    it('should throw http exception on error', async () => {
        (repository as any)._exists = jest.fn().mockRejectedValue(new Error());
        await expect(repository.checkUsernameExists('test')).rejects.toThrow(HttpException);
    });
  });

  describe('checkEmailExists', () => {
    it('should check if email exists', async () => {
        (repository as any)._exists = jest.fn().mockResolvedValue(true);
        const result = await repository.checkEmailExists('test@test.com');
        expect(result).toBe(true);
    });

    it('should throw http exception on error', async () => {
        (repository as any)._exists = jest.fn().mockRejectedValue(new Error());
        await expect(repository.checkEmailExists('test@test.com')).rejects.toThrow(HttpException);
    });
  });
});
