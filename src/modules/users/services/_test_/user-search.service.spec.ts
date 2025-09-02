import { Test, TestingModule } from '@nestjs/testing';
import { UserSearchService } from '../user-search.service';
import { IUserSearchRepository } from '../../interfaces/user-search.repository.interface';
import { PaginationDto, PaginatedResult } from '../../../../common/dto/pagination.dto';
import { UserFiltersDto, UserCsvExportFiltersDto, UserExactSearchDto } from '../../dto';
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

describe('UserSearchService', () => {
  let service: UserSearchService;
  let repository: jest.Mocked<IUserSearchRepository>;

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
    const mockRepository: jest.Mocked<IUserSearchRepository> = {
      searchUsers: jest.fn(),
      filterUsers: jest.fn(),
      exactSearchUsers: jest.fn(),
      checkEmailExists: jest.fn(),
      checkUsernameExists: jest.fn(),
      findUsersWithFilters: jest.fn(),
      exportUsersToCsv: jest.fn(),
      authenticateUser: jest.fn(),
      simpleFilterUsers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSearchService,
        {
          provide: 'IUserSearchRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserSearchService>(UserSearchService);
    repository = module.get('IUserSearchRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    const paginationDto = createPaginationDto();

    it('should search users successfully', async () => {
      const searchTerm = 'test';
      repository.searchUsers.mockResolvedValue(mockPaginatedResult);

      const result = await service.search(searchTerm, paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(repository.searchUsers).toHaveBeenCalledWith(searchTerm, paginationDto);
      expect(repository.searchUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle empty search term', async () => {
      const searchTerm = '';
      repository.searchUsers.mockResolvedValue({ data: [], meta: { ...mockPaginatedResult.meta, total: 0 } });

      const result = await service.search(searchTerm, paginationDto);

      expect(result).toEqual({ data: [], meta: { ...mockPaginatedResult.meta, total: 0 } });
      expect(repository.searchUsers).toHaveBeenCalledWith(searchTerm, paginationDto);
      expect(repository.searchUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors during search', async () => {
      const searchTerm = 'test';
      const error = new Error('Search failed');
      repository.searchUsers.mockRejectedValue(error);

      await expect(service.search(searchTerm, paginationDto)).rejects.toThrow('Search failed');
      expect(repository.searchUsers).toHaveBeenCalledWith(searchTerm, paginationDto);
    });
  });

  describe('filterSearch', () => {
    const paginationDto = createPaginationDto();

    it('should filter users successfully with valid filter term', async () => {
      const filterTerm = 'test filter';
      repository.filterUsers.mockResolvedValue(mockPaginatedResult);

      const result = await service.filterSearch(filterTerm, paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(repository.filterUsers).toHaveBeenCalledWith('test filter', paginationDto);
      expect(repository.filterUsers).toHaveBeenCalledTimes(1);
    });

    it('should trim filter term before processing', async () => {
      const filterTerm = '  test filter  ';
      repository.filterUsers.mockResolvedValue(mockPaginatedResult);

      const result = await service.filterSearch(filterTerm, paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(repository.filterUsers).toHaveBeenCalledWith('test filter', paginationDto);
      expect(repository.filterUsers).toHaveBeenCalledTimes(1);
    });

    it('should throw error when filter term is less than 3 characters', async () => {
      const filterTerm = 'ab';

      await expect(service.filterSearch(filterTerm, paginationDto)).rejects.toThrow(
        'Filter term must be at least 3 characters long',
      );
      expect(repository.filterUsers).not.toHaveBeenCalled();
    });

    it('should throw error when filter term is empty', async () => {
      const filterTerm = '';

      await expect(service.filterSearch(filterTerm, paginationDto)).rejects.toThrow(
        'Filter term must be at least 3 characters long',
      );
      expect(repository.filterUsers).not.toHaveBeenCalled();
    });

    it('should throw error when filter term is null/undefined', async () => {
      await expect(service.filterSearch(null as any, paginationDto)).rejects.toThrow(
        'Filter term must be at least 3 characters long',
      );

      await expect(service.filterSearch(undefined as any, paginationDto)).rejects.toThrow(
        'Filter term must be at least 3 characters long',
      );

      expect(repository.filterUsers).not.toHaveBeenCalled();
    });

    it('should throw error when trimmed filter term is less than 3 characters', async () => {
      const filterTerm = '  ab  ';

      await expect(service.filterSearch(filterTerm, paginationDto)).rejects.toThrow(
        'Filter term must be at least 3 characters long',
      );
      expect(repository.filterUsers).not.toHaveBeenCalled();
    });

    it('should handle repository errors during filter search', async () => {
      const filterTerm = 'test filter';
      const error = new Error('Filter failed');
      repository.filterUsers.mockRejectedValue(error);

      await expect(service.filterSearch(filterTerm, paginationDto)).rejects.toThrow('Filter failed');
      expect(repository.filterUsers).toHaveBeenCalledWith('test filter', paginationDto);
    });
  });

  describe('findByEmail', () => {
    it('should return true when email exists', async () => {
      const email = 'test@example.com';
      repository.checkEmailExists.mockResolvedValue(true);

      const result = await service.findByEmail(email);

      expect(result).toBe(true);
      expect(repository.checkEmailExists).toHaveBeenCalledWith(email);
      expect(repository.checkEmailExists).toHaveBeenCalledTimes(1);
    });

    it('should return false when email does not exist', async () => {
      const email = 'nonexistent@example.com';
      repository.checkEmailExists.mockResolvedValue(false);

      const result = await service.findByEmail(email);

      expect(result).toBe(false);
      expect(repository.checkEmailExists).toHaveBeenCalledWith(email);
      expect(repository.checkEmailExists).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors when checking email', async () => {
      const email = 'test@example.com';
      const error = new Error('Email check failed');
      repository.checkEmailExists.mockRejectedValue(error);

      await expect(service.findByEmail(email)).rejects.toThrow('Email check failed');
      expect(repository.checkEmailExists).toHaveBeenCalledWith(email);
    });
  });

  describe('findWithFilters', () => {
    const paginationDto = createPaginationDto();

    it('should find users with filters successfully', async () => {
      const filters: UserFiltersDto = {
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.USER,
        isActive: true,
      };
      repository.findUsersWithFilters.mockResolvedValue(mockPaginatedResult);

      const result = await service.findWithFilters(filters, paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(repository.findUsersWithFilters).toHaveBeenCalledWith(filters, paginationDto);
      expect(repository.findUsersWithFilters).toHaveBeenCalledTimes(1);
    });

    it('should handle empty filters', async () => {
      const filters: UserFiltersDto = {};
      repository.findUsersWithFilters.mockResolvedValue(mockPaginatedResult);

      const result = await service.findWithFilters(filters, paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(repository.findUsersWithFilters).toHaveBeenCalledWith(filters, paginationDto);
      expect(repository.findUsersWithFilters).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors when finding with filters', async () => {
      const filters: UserFiltersDto = { name: 'Test' };
      const error = new Error('Filter search failed');
      repository.findUsersWithFilters.mockRejectedValue(error);

      await expect(service.findWithFilters(filters, paginationDto)).rejects.toThrow(
        'Filter search failed',
      );
      expect(repository.findUsersWithFilters).toHaveBeenCalledWith(filters, paginationDto);
    });
  });

  describe('exportToCsv', () => {
    it('should export users to CSV successfully', async () => {
      const filters: UserCsvExportFiltersDto = {
        name: 'Test User',
        email: 'test@example.com',
        role: UserRole.USER,
        isActive: true,
        createdDateFrom: '2023-01-01',
        createdDateTo: '2023-12-31',
      };
      const csvContent = 'id,username,email,firstName,lastName\n123,testuser,test@example.com,Test,User';
      repository.exportUsersToCsv.mockResolvedValue(csvContent);

      const result = await service.exportToCsv(filters);

      expect(result).toBe(csvContent);
      expect(repository.exportUsersToCsv).toHaveBeenCalledWith(filters);
      expect(repository.exportUsersToCsv).toHaveBeenCalledTimes(1);
    });

    it('should handle empty filters for CSV export', async () => {
      const filters: UserCsvExportFiltersDto = {};
      const csvContent = 'id,username,email,firstName,lastName\n';
      repository.exportUsersToCsv.mockResolvedValue(csvContent);

      const result = await service.exportToCsv(filters);

      expect(result).toBe(csvContent);
      expect(repository.exportUsersToCsv).toHaveBeenCalledWith(filters);
      expect(repository.exportUsersToCsv).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors during CSV export', async () => {
      const filters: UserCsvExportFiltersDto = { name: 'Test' };
      const error = new Error('CSV export failed');
      repository.exportUsersToCsv.mockRejectedValue(error);

      await expect(service.exportToCsv(filters)).rejects.toThrow('CSV export failed');
      expect(repository.exportUsersToCsv).toHaveBeenCalledWith(filters);
    });
  });

  describe('findToLoginByEmail', () => {
    it('should return user when found for login', async () => {
      const email = 'test@example.com';
      repository.authenticateUser.mockResolvedValue(mockUser);

      const result = await service.findToLoginByEmail(email);

      expect(result).toEqual(mockUser);
      expect(repository.authenticateUser).toHaveBeenCalledWith(email);
      expect(repository.authenticateUser).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found for login', async () => {
      const email = 'nonexistent@example.com';
      repository.authenticateUser.mockResolvedValue(null);

      const result = await service.findToLoginByEmail(email);

      expect(result).toBeNull();
      expect(repository.authenticateUser).toHaveBeenCalledWith(email);
      expect(repository.authenticateUser).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors during login user search', async () => {
      const email = 'test@example.com';
      const error = new Error('Authentication search failed');
      repository.authenticateUser.mockRejectedValue(error);

      await expect(service.findToLoginByEmail(email)).rejects.toThrow(
        'Authentication search failed',
      );
      expect(repository.authenticateUser).toHaveBeenCalledWith(email);
    });
  });

  describe('exactSearch', () => {
    const searchDto: UserExactSearchDto = {
      email: 'test@example.com',
      username: 'testuser',
    };
    const paginationDto = createPaginationDto();

    it('should perform exact search successfully', async () => {
      repository.exactSearchUsers.mockResolvedValue(mockPaginatedResult);

      const result = await service.exactSearch(searchDto, paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(repository.exactSearchUsers).toHaveBeenCalledWith(searchDto, paginationDto, undefined, undefined);
      expect(repository.exactSearchUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle exact search with user context', async () => {
      repository.exactSearchUsers.mockResolvedValue(mockPaginatedResult);

      const result = await service.exactSearch(searchDto, paginationDto, 'user123', 'admin');

      expect(result).toEqual(mockPaginatedResult);
      expect(repository.exactSearchUsers).toHaveBeenCalledWith(searchDto, paginationDto, 'user123', 'admin');
      expect(repository.exactSearchUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors during exact search', async () => {
      const error = new Error('Exact search failed');
      repository.exactSearchUsers.mockRejectedValue(error);

      await expect(service.exactSearch(searchDto, paginationDto)).rejects.toThrow('Exact search failed');
      expect(repository.exactSearchUsers).toHaveBeenCalledWith(searchDto, paginationDto, undefined, undefined);
    });
  });

  describe('simpleFilter', () => {
    const paginationDto = createPaginationDto();

    it('should perform simple filter successfully', async () => {
      const term = 'filter term';
      const userId = 'user-123';
      const userRole = UserRole.ADMIN;
      repository.simpleFilterUsers.mockResolvedValue(mockPaginatedResult);

      const result = await service.simpleFilter(term, paginationDto, userId, userRole);

      expect(result).toEqual(mockPaginatedResult);
      expect(repository.simpleFilterUsers).toHaveBeenCalledWith(term, paginationDto, userId, userRole);
      expect(repository.simpleFilterUsers).toHaveBeenCalledTimes(1);
    });

    it('should perform simple filter without optional parameters', async () => {
      const term = 'filter term';
      repository.simpleFilterUsers.mockResolvedValue(mockPaginatedResult);

      const result = await service.simpleFilter(term, paginationDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(repository.simpleFilterUsers).toHaveBeenCalledWith(term, paginationDto, undefined, undefined);
      expect(repository.simpleFilterUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle empty filter term', async () => {
      const term = '';
      repository.simpleFilterUsers.mockResolvedValue({ data: [], meta: { ...mockPaginatedResult.meta, total: 0 } });

      const result = await service.simpleFilter(term, paginationDto);

      expect(result).toEqual({ data: [], meta: { ...mockPaginatedResult.meta, total: 0 } });
      expect(repository.simpleFilterUsers).toHaveBeenCalledWith(term, paginationDto, undefined, undefined);
      expect(repository.simpleFilterUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors during simple filter', async () => {
      const term = 'filter term';
      const error = new Error('Simple filter failed');
      repository.simpleFilterUsers.mockRejectedValue(error);

      await expect(service.simpleFilter(term, paginationDto)).rejects.toThrow('Simple filter failed');
      expect(repository.simpleFilterUsers).toHaveBeenCalledWith(term, paginationDto, undefined, undefined);
    });
  });
});