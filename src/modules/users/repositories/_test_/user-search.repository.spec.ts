import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { UserSearchRepository } from '../user-search.repository';
import { User } from '../../entities/user.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
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

describe('UserSearchRepository', () => {
  let repository: UserSearchRepository;
  let userRepo: Repository<User>;
  let consoleSpy: jest.SpyInstance;

  beforeEach(async () => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSearchRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            count: jest.fn(),
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

    repository = module.get<UserSearchRepository>(UserSearchRepository);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('authenticateUser', () => {
    it('should authenticate user successfully', async () => {
      (repository as any)._findOne = jest.fn().mockResolvedValue(mockUser as User);

      const result = await repository.authenticateUser('test@example.com');

      expect((repository as any)._findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found for authentication', async () => {
      (repository as any)._findOne = jest.fn().mockResolvedValue(null);

      const result = await repository.authenticateUser('notfound@example.com');

      expect((repository as any)._findOne).toHaveBeenCalledWith({
        where: { email: 'notfound@example.com' },
      });
      expect(result).toBeNull();
    });

    it('should throw HttpException when authentication fails', async () => {
      (repository as any)._findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(repository.authenticateUser('test@example.com')).rejects.toThrow(
        new HttpException('Authentication failed', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });

    it('should normalize email to lowercase and trim', async () => {
      (repository as any)._findOne = jest.fn().mockResolvedValue(mockUser as User);

      await repository.authenticateUser('  TEST@EXAMPLE.COM  ');

      expect((repository as any)._findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('searchUsers', () => {
    it('should search users by username and email', async () => {
      const searchTerm = 'test';
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockUser], meta: { total: 1, page: 1, limit: 10 } };

      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.searchUsers(searchTerm, pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalledWith(
        {
          where: [{ username: ILike(`%${searchTerm}%`) }, { email: ILike(`%${searchTerm}%`) }],
          order: { [pagination.sortBy]: pagination.sortOrder },
          skip: pagination.offset,
          take: pagination.limit,
        },
        pagination,
      );
      expect(result).toEqual(paginatedResult);
    });

    it('should throw HttpException when search fails', async () => {
      const searchTerm = 'test';
      const pagination = new PaginationDto();

      (repository as any)._findManyWithPagination = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.searchUsers(searchTerm, pagination)).rejects.toThrow(
        new HttpException('Failed to search users', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('checkUsernameExists', () => {
    it('should return true when username exists', async () => {
      (repository as any)._exists = jest.fn().mockResolvedValue(true);

      const result = await repository.checkUsernameExists('testuser');

      expect((repository as any)._exists).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
      expect(result).toBe(true);
    });

    it('should return false when username does not exist', async () => {
      (repository as any)._exists = jest.fn().mockResolvedValue(false);

      const result = await repository.checkUsernameExists('nonexistent');

      expect((repository as any)._exists).toHaveBeenCalledWith({
        where: { username: 'nonexistent' },
      });
      expect(result).toBe(false);
    });

    it('should normalize username to lowercase and trim', async () => {
      (repository as any)._exists = jest.fn().mockResolvedValue(true);

      await repository.checkUsernameExists('  TESTUSER  ');

      expect((repository as any)._exists).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
    });

    it('should throw HttpException when check fails', async () => {
      (repository as any)._exists = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(repository.checkUsernameExists('testuser')).rejects.toThrow(
        new HttpException('Failed to check username existence', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('checkEmailExists', () => {
    it('should return true when email exists', async () => {
      (repository as any)._exists = jest.fn().mockResolvedValue(true);

      const result = await repository.checkEmailExists('test@example.com');

      expect((repository as any)._exists).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toBe(true);
    });

    it('should return false when email does not exist', async () => {
      (repository as any)._exists = jest.fn().mockResolvedValue(false);

      const result = await repository.checkEmailExists('notfound@example.com');

      expect((repository as any)._exists).toHaveBeenCalledWith({
        where: { email: 'notfound@example.com' },
      });
      expect(result).toBe(false);
    });

    it('should normalize email to lowercase and trim', async () => {
      (repository as any)._exists = jest.fn().mockResolvedValue(true);

      await repository.checkEmailExists('  TEST@EXAMPLE.COM  ');

      expect((repository as any)._exists).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw HttpException when check fails', async () => {
      (repository as any)._exists = jest.fn().mockRejectedValue(new Error('Database error'));

      await expect(repository.checkEmailExists('test@example.com')).rejects.toThrow(
        new HttpException('Failed to check email existence', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });
});
