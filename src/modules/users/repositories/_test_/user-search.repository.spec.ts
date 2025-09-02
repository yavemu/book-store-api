import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ILike, Between, MoreThanOrEqual, LessThanOrEqual, IsNull, Not } from 'typeorm';
import { UserSearchRepository } from '../user-search.repository';
import { User } from '../../entities/user.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { UserFiltersDto, UserCsvExportFiltersDto } from '../../dto';
import { UserFactory, PaginationFactory, RoleFactory } from '../../../../common/test-factories';
import { HttpException } from '@nestjs/common';
import { UserRole } from '../../../../common/enums/user-role.enum';

describe('UserSearchRepository', () => {
  let repository: UserSearchRepository;
  let mockRepository: jest.Mocked<Repository<User>>;
  let userFactory: UserFactory;
  let paginationFactory: PaginationFactory;
  let roleFactory: RoleFactory;

  beforeEach(async () => {
    userFactory = new UserFactory();
    paginationFactory = new PaginationFactory();
    roleFactory = new RoleFactory();

    mockRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        cache: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      })),
    } as any;

    const mockAuditLogService = {
      logAction: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSearchRepository,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: 'IAuditLoggerService',
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    repository = module.get<UserSearchRepository>(UserSearchRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('authenticateUser()', () => {
    it('should find user by email for authentication', async () => {
      const email = 'Test@Example.Com'; // Mixed case
      const mockUser = userFactory.create({ email: email.toLowerCase() });

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await repository.authenticateUser(email);

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await repository.authenticateUser('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Database error'));

      const result = await repository.authenticateUser('test@example.com');

      expect(result).toBeNull();
    });

    it('should normalize email to lowercase and trim whitespace', async () => {
      const email = '  Test@Example.Com  ';
      mockRepository.findOne.mockResolvedValue(null);

      await repository.authenticateUser(email);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('searchUsers()', () => {
    it('should search users by username and email', async () => {
      const searchTerm = 'john';
      const pagination = paginationFactory.create();
      const mockUsers = userFactory.createMany(3);
      const total = 15;

      mockRepository.findAndCount.mockResolvedValue([mockUsers, total]);

      const result = await repository.searchUsers(searchTerm, pagination);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(total);
      expect(result.meta.page).toBe(pagination.page);
      expect(result.meta.limit).toBe(pagination.limit);
    });

    it('should handle empty search results', async () => {
      const searchTerm = 'nonexistent';
      const pagination = paginationFactory.create();

      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      const result = await repository.searchUsers(searchTerm, pagination);

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('should handle repository errors', async () => {
      const searchTerm = 'john';
      const pagination = paginationFactory.create();

      mockRepository.findAndCount.mockRejectedValue(new Error('Database error'));

      await expect(repository.searchUsers(searchTerm, pagination)).rejects.toThrow(HttpException);
    });
  });

  describe('filterUsers()', () => {
    it('should filter users with performance optimizations', async () => {
      const filterTerm = 'admin';
      const pagination = paginationFactory.create({ limit: 20 });
      const mockUsers = userFactory.createMany(5);

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 5]);

      const result = await repository.filterUsers(filterTerm, pagination);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(5);
    });

    it('should limit results to 50 for performance', async () => {
      const filterTerm = 'user';
      const pagination = paginationFactory.createLargePage(100);
      const mockUsers = userFactory.createMany(50);

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 50]);

      const result = await repository.filterUsers(filterTerm, pagination);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(50);
    });

    it('should handle repository errors', async () => {
      const filterTerm = 'user';
      const pagination = paginationFactory.create();

      mockRepository.findAndCount.mockRejectedValue(new Error('Database error'));

      await expect(repository.filterUsers(filterTerm, pagination)).rejects.toThrow(HttpException);
    });
  });

  describe('checkUsernameExists()', () => {
    it('should return true when username exists', async () => {
      mockRepository.count.mockResolvedValue(1);

      const result = await repository.checkUsernameExists('ExistingUser');

      expect(result).toBe(true);
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { username: 'existinguser' },
      });
    });

    it('should return false when username does not exist', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await repository.checkUsernameExists('nonexistentuser');

      expect(result).toBe(false);
    });

    it('should handle repository errors', async () => {
      mockRepository.count.mockRejectedValue(new Error('Database error'));

      await expect(repository.checkUsernameExists('testuser')).rejects.toThrow(HttpException);
    });

    it('should normalize username to lowercase and trim whitespace', async () => {
      mockRepository.count.mockResolvedValue(0);

      await repository.checkUsernameExists('  TestUser  ');

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { username: 'testuser' },
      });
    });
  });

  describe('checkEmailExists()', () => {
    it('should return true when email exists', async () => {
      mockRepository.count.mockResolvedValue(1);

      const result = await repository.checkEmailExists('Existing@Example.Com');

      expect(result).toBe(true);
      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { email: 'existing@example.com' },
      });
    });

    it('should return false when email does not exist', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await repository.checkEmailExists('nonexistent@example.com');

      expect(result).toBe(false);
    });

    it('should handle repository errors', async () => {
      mockRepository.count.mockRejectedValue(new Error('Database error'));

      await expect(repository.checkEmailExists('test@example.com')).rejects.toThrow(HttpException);
    });
  });

  describe('findUsersWithFilters()', () => {
    it('should filter users by name', async () => {
      const filters: UserFiltersDto = { name: 'john' };
      const pagination = paginationFactory.create();
      const mockUsers = userFactory.createMany(2);

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      const result = await repository.findUsersWithFilters(filters, pagination);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(2);
    });

    it('should filter users by email', async () => {
      const filters: UserFiltersDto = { email: 'example.com' };
      const pagination = paginationFactory.create();
      const mockUsers = userFactory.createMany(3);

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 3]);

      const result = await repository.findUsersWithFilters(filters, pagination);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(3);
    });

    it('should filter active users', async () => {
      const filters: UserFiltersDto = { isActive: true };
      const pagination = paginationFactory.create();
      const mockUsers = userFactory.createMany(5, [{ deletedAt: null }]);

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 5]);

      const result = await repository.findUsersWithFilters(filters, pagination);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(5);
    });

    it('should filter inactive users', async () => {
      const filters: UserFiltersDto = { isActive: false };
      const pagination = paginationFactory.create();
      const mockUsers = userFactory.createMany(2, [{ deletedAt: new Date() }]);

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 2]);

      const result = await repository.findUsersWithFilters(filters, pagination);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(2);
    });

    it('should filter by role', async () => {
      const role = roleFactory.createAdmin();
      const filters: UserFiltersDto = { role: UserRole.ADMIN };
      const pagination = paginationFactory.create();
      const mockUsers = userFactory.createMany(1, [{ role }]);

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await repository.findUsersWithFilters(filters, pagination);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(1);
    });

    it('should apply multiple filters', async () => {
      const filters: UserFiltersDto = {
        name: 'john',
        email: 'example.com',
        isActive: true,
      };
      const pagination = paginationFactory.create();
      const mockUsers = userFactory.createMany(1);

      mockRepository.findAndCount.mockResolvedValue([mockUsers, 1]);

      const result = await repository.findUsersWithFilters(filters, pagination);

      expect(result.data).toEqual(mockUsers);
      expect(result.meta.total).toBe(1);
    });

    it('should handle repository errors', async () => {
      const filters: UserFiltersDto = { name: 'john' };
      const pagination = paginationFactory.create();

      mockRepository.findAndCount.mockRejectedValue(new Error('Database error'));

      await expect(repository.findUsersWithFilters(filters, pagination)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('exportUsersToCsv()', () => {
    it('should export users to CSV with all data', async () => {
      const filters: UserCsvExportFiltersDto = {};
      const adminRole = roleFactory.createAdmin();
      const mockUsers = [
        userFactory.create({
          id: 'user-1',
          username: 'admin',
          email: 'admin@example.com',
          role: adminRole,
          deletedAt: null,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02'),
        }),
        userFactory.create({
          id: 'user-2',
          username: 'user',
          email: 'user@example.com',
          role: roleFactory.createUser(),
          deletedAt: new Date('2023-01-05'),
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-03'),
        }),
      ];

      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await repository.exportUsersToCsv(filters);

      expect(result).toContain('ID,Username,Email,Role,Is Active,Created At,Updated At');
      expect(result).toContain('user-1,"admin","admin@example.com","admin","true"');
      expect(result).toContain('user-2,"user","user@example.com","user","false"');
    });

    it('should return CSV headers when no users found', async () => {
      const filters: UserCsvExportFiltersDto = {};
      mockRepository.find.mockResolvedValue([]);

      const result = await repository.exportUsersToCsv(filters);

      expect(result).toBe('ID,Username,Email,Role,Is Active,Created At,Updated At\n');
    });

    it('should apply name filter in CSV export', async () => {
      const filters: UserCsvExportFiltersDto = { name: 'admin' };
      const mockUsers = userFactory.createMany(1);

      mockRepository.find.mockResolvedValue(mockUsers);

      await repository.exportUsersToCsv(filters);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: expect.objectContaining({
          username: ILike('%admin%'),
        }),
        order: { createdAt: 'DESC' },
      });
    });

    it('should apply email filter in CSV export', async () => {
      const filters: UserCsvExportFiltersDto = { email: 'example.com' };
      const mockUsers = userFactory.createMany(1);

      mockRepository.find.mockResolvedValue(mockUsers);

      await repository.exportUsersToCsv(filters);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: expect.objectContaining({
          email: ILike('%example.com%'),
        }),
        order: { createdAt: 'DESC' },
      });
    });

    it('should apply date range filters in CSV export', async () => {
      const filters: UserCsvExportFiltersDto = {
        createdDateFrom: '2023-01-01',
        createdDateTo: '2023-12-31',
        updatedDateFrom: '2023-06-01',
        updatedDateTo: '2023-12-31',
      };
      const mockUsers = userFactory.createMany(1);

      mockRepository.find.mockResolvedValue(mockUsers);

      await repository.exportUsersToCsv(filters);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: expect.objectContaining({
          createdAt: Between(new Date('2023-01-01'), new Date('2023-12-31')),
          updatedAt: Between(new Date('2023-06-01'), new Date('2023-12-31')),
        }),
        order: { createdAt: 'DESC' },
      });
    });

    it('should apply single date filters in CSV export', async () => {
      const filters: UserCsvExportFiltersDto = {
        createdDateFrom: '2023-01-01',
        updatedDateTo: '2023-12-31',
      };
      const mockUsers = userFactory.createMany(1);

      mockRepository.find.mockResolvedValue(mockUsers);

      await repository.exportUsersToCsv(filters);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: expect.objectContaining({
          createdAt: MoreThanOrEqual(new Date('2023-01-01')),
          updatedAt: LessThanOrEqual(new Date('2023-12-31')),
        }),
        order: { createdAt: 'DESC' },
      });
    });

    it('should apply isActive filter in CSV export', async () => {
      const filters: UserCsvExportFiltersDto = { isActive: true };
      const mockUsers = userFactory.createMany(1);

      mockRepository.find.mockResolvedValue(mockUsers);

      await repository.exportUsersToCsv(filters);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: expect.objectContaining({
          deletedAt: IsNull(),
        }),
        order: { createdAt: 'DESC' },
      });
    });

    it('should handle repository errors', async () => {
      const filters: UserCsvExportFiltersDto = {};

      mockRepository.find.mockRejectedValue(new Error('Database error'));

      await expect(repository.exportUsersToCsv(filters)).rejects.toThrow(HttpException);
    });

    it('should handle users with missing role data', async () => {
      const filters: UserCsvExportFiltersDto = {};
      const mockUsers = [
        userFactory.create({
          id: 'user-1',
          username: 'test',
          email: 'test@example.com',
          role: null, // Missing role
          deletedAt: null,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02'),
        }),
      ];

      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await repository.exportUsersToCsv(filters);

      expect(result).toContain('user-1,"test","test@example.com","","true"');
    });

    it('should handle users with missing dates', async () => {
      const filters: UserCsvExportFiltersDto = {};
      const mockUsers = [
        userFactory.create({
          id: 'user-1',
          username: 'test',
          email: 'test@example.com',
          role: roleFactory.createUser(),
          deletedAt: null,
          createdAt: null, // Missing date
          updatedAt: null, // Missing date
        }),
      ];

      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await repository.exportUsersToCsv(filters);

      expect(result).toContain('user-1,"test","test@example.com","user","true","",""');
    });
  });
});
