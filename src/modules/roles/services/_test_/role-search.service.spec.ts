import { Test, TestingModule } from '@nestjs/testing';
import { RoleSearchService } from '../role-search.service';
import { IRoleSearchRepository } from '../../interfaces/role-search.repository.interface';
import { IErrorHandlerService } from '../../interfaces/error-handler.service.interface';
import { Role } from '../../entities/role.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../../common/interfaces/paginated-result.interface';
import { ERROR_MESSAGES } from '../../../../common/constants/error-messages';
import { UserRole } from '../../../../common/enums/user-role.enum';

describe('RoleSearchService', () => {
  let service: RoleSearchService;
  let searchRepository: IRoleSearchRepository;
  let errorHandler: IErrorHandlerService;

  const mockRole: Role = {
    id: '1',
    name: 'admin',
    description: 'Administrator role with full permissions',
    isActive: true,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    normalizeRoleName: jest.fn(),
  };

  const mockManagerRole: Role = {
    id: '2',
    name: 'manager',
    description: 'Manager role with limited permissions',
    isActive: true,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    normalizeRoleName: jest.fn(),
  };

  const mockInactiveRole: Role = {
    id: '3',
    name: 'inactive_role',
    description: 'Inactive role for testing',
    isActive: false,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    normalizeRoleName: jest.fn(),
  };

  const mockPaginatedResult: PaginatedResult<Role> = {
    data: [mockRole, mockManagerRole],
    meta: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };

  const mockSearchRepository = {
    findByName: jest.fn(),
    findActiveRoles: jest.fn(),
    findRolesByPermission: jest.fn(),
    searchRoles: jest.fn(),
    findInactiveRoles: jest.fn(),
    findRolesByPattern: jest.fn(),
  };

  const mockErrorHandler = {
    handleError: jest.fn(),
    createNotFoundException: jest.fn(),
    createConflictException: jest.fn(),
    createBadRequestException: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleSearchService,
        { provide: 'IRoleSearchRepository', useValue: mockSearchRepository },
        { provide: 'IErrorHandlerService', useValue: mockErrorHandler },
      ],
    }).compile();

    service = module.get<RoleSearchService>(RoleSearchService);
    searchRepository = module.get<IRoleSearchRepository>('IRoleSearchRepository');
    errorHandler = module.get<IErrorHandlerService>('IErrorHandlerService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByName', () => {
    it('should find a role by name', async () => {
      const name = 'admin';

      mockSearchRepository.findByName.mockResolvedValue(mockRole);

      const result = await service.findByName(name);

      expect(searchRepository.findByName).toHaveBeenCalledWith(name);
      expect(result).toEqual(mockRole);
    });

    it('should handle repository errors during findByName', async () => {
      const name = 'admin';
      const error = new Error('Database connection failed');

      mockSearchRepository.findByName.mockRejectedValue(error);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw error;
      });

      await expect(service.findByName(name)).rejects.toThrow(error);

      expect(errorHandler.handleError).toHaveBeenCalledWith(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_GET_ALL || 'Failed to retrieve role',
      );
    });

    it('should handle case-sensitive role name search', async () => {
      const name = UserRole.ADMIN;

      mockSearchRepository.findByName.mockResolvedValue(mockRole);

      const result = await service.findByName(name);

      expect(searchRepository.findByName).toHaveBeenCalledWith(name);
      expect(result).toEqual(mockRole);
    });
  });

  describe('findActiveRoles', () => {
    it('should find active roles with pagination', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockSearchRepository.findActiveRoles.mockResolvedValue(mockPaginatedResult);

      const result = await service.findActiveRoles(pagination);

      expect(searchRepository.findActiveRoles).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle empty active roles result', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<Role> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockSearchRepository.findActiveRoles.mockResolvedValue(emptyResult);

      const result = await service.findActiveRoles(pagination);

      expect(result).toEqual(emptyResult);
    });

    it('should handle repository errors during findActiveRoles', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const error = new Error('Database query failed');

      mockSearchRepository.findActiveRoles.mockRejectedValue(error);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw error;
      });

      await expect(service.findActiveRoles(pagination)).rejects.toThrow(error);

      expect(errorHandler.handleError).toHaveBeenCalledWith(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_GET_ALL || 'Failed to retrieve active roles',
      );
    });

    it('should handle different pagination parameters', async () => {
      const pagination = new PaginationDto();
      pagination.page = 2;
      pagination.limit = 5;
      const paginatedResult: PaginatedResult<Role> = {
        data: [mockManagerRole],
        meta: { total: 6, page: 2, limit: 5, totalPages: 2, hasNext: false, hasPrev: true },
      };

      mockSearchRepository.findActiveRoles.mockResolvedValue(paginatedResult);

      const result = await service.findActiveRoles(pagination);

      expect(searchRepository.findActiveRoles).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findRolesByPermission', () => {
    it('should find roles by permission', async () => {
      const permission = 'users:read';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockSearchRepository.findRolesByPermission.mockResolvedValue(mockPaginatedResult);

      const result = await service.findRolesByPermission(permission, pagination);

      expect(searchRepository.findRolesByPermission).toHaveBeenCalledWith(permission, pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle roles with specific permission', async () => {
      const permission = 'books:write';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const adminOnlyResult: PaginatedResult<Role> = {
        data: [mockRole],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false },
      };

      mockSearchRepository.findRolesByPermission.mockResolvedValue(adminOnlyResult);

      const result = await service.findRolesByPermission(permission, pagination);

      expect(result).toEqual(adminOnlyResult);
    });

    it('should handle no roles found for permission', async () => {
      const permission = 'super:admin';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<Role> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockSearchRepository.findRolesByPermission.mockResolvedValue(emptyResult);

      const result = await service.findRolesByPermission(permission, pagination);

      expect(result).toEqual(emptyResult);
    });

    it('should handle repository errors during permission search', async () => {
      const permission = 'users:read';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const error = new Error('Permission lookup failed');

      mockSearchRepository.findRolesByPermission.mockRejectedValue(error);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw error;
      });

      await expect(service.findRolesByPermission(permission, pagination)).rejects.toThrow(error);

      expect(errorHandler.handleError).toHaveBeenCalledWith(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_GET_ALL || 'Failed to retrieve roles by permission',
      );
    });
  });

  describe('searchRoles', () => {
    it('should search roles by term', async () => {
      const term = 'admin';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockSearchRepository.searchRoles.mockResolvedValue(mockPaginatedResult);

      const result = await service.searchRoles(term, pagination);

      expect(searchRepository.searchRoles).toHaveBeenCalledWith(term, pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle partial name search', async () => {
      const term = 'man';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const managerResult: PaginatedResult<Role> = {
        data: [mockManagerRole],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false },
      };

      mockSearchRepository.searchRoles.mockResolvedValue(managerResult);

      const result = await service.searchRoles(term, pagination);

      expect(result).toEqual(managerResult);
    });

    it('should handle search by description', async () => {
      const term = 'permissions';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockSearchRepository.searchRoles.mockResolvedValue(mockPaginatedResult);

      const result = await service.searchRoles(term, pagination);

      expect(searchRepository.searchRoles).toHaveBeenCalledWith(term, pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle empty search term', async () => {
      const term = '';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockSearchRepository.searchRoles.mockResolvedValue(mockPaginatedResult);

      const result = await service.searchRoles(term, pagination);

      expect(searchRepository.searchRoles).toHaveBeenCalledWith(term, pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle search with no results', async () => {
      const term = 'nonexistent';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<Role> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockSearchRepository.searchRoles.mockResolvedValue(emptyResult);

      const result = await service.searchRoles(term, pagination);

      expect(result).toEqual(emptyResult);
    });

    it('should handle repository errors during search', async () => {
      const term = 'admin';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const error = new Error('Search service unavailable');

      mockSearchRepository.searchRoles.mockRejectedValue(error);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw error;
      });

      await expect(service.searchRoles(term, pagination)).rejects.toThrow(error);

      expect(errorHandler.handleError).toHaveBeenCalledWith(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_GET_ALL || 'Failed to search roles',
      );
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle null role name search', async () => {
      const name = null as any;
      const error = new Error('Invalid role name provided');

      mockSearchRepository.findByName.mockRejectedValue(error);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw error;
      });

      await expect(service.findByName(name)).rejects.toThrow(error);
    });

    it('should handle undefined pagination parameters', async () => {
      const pagination = undefined as any;
      const error = new Error('Invalid pagination parameters');

      mockSearchRepository.findActiveRoles.mockRejectedValue(error);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw error;
      });

      await expect(service.findActiveRoles(pagination)).rejects.toThrow(error);
    });

    it('should handle special characters in search term', async () => {
      const term = 'admin@#$%';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<Role> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockSearchRepository.searchRoles.mockResolvedValue(emptyResult);

      const result = await service.searchRoles(term, pagination);

      expect(searchRepository.searchRoles).toHaveBeenCalledWith(term, pagination);
      expect(result).toEqual(emptyResult);
    });

    it('should handle very long search terms', async () => {
      const term = 'a'.repeat(1000);
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<Role> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockSearchRepository.searchRoles.mockResolvedValue(emptyResult);

      const result = await service.searchRoles(term, pagination);

      expect(result).toEqual(emptyResult);
    });

    it('should handle invalid permission format', async () => {
      const permission = 'invalid::permission::format';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<Role> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockSearchRepository.findRolesByPermission.mockResolvedValue(emptyResult);

      const result = await service.findRolesByPermission(permission, pagination);

      expect(result).toEqual(emptyResult);
    });
  });

  describe('pagination edge cases', () => {
    it('should handle page number zero', async () => {
      const pagination = new PaginationDto();
      pagination.page = 0;
      pagination.limit = 10;

      mockSearchRepository.findActiveRoles.mockResolvedValue(mockPaginatedResult);

      const result = await service.findActiveRoles(pagination);

      expect(searchRepository.findActiveRoles).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle negative page numbers', async () => {
      const pagination = new PaginationDto();
      pagination.page = -1;
      pagination.limit = 10;

      mockSearchRepository.findActiveRoles.mockResolvedValue(mockPaginatedResult);

      const result = await service.findActiveRoles(pagination);

      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle very large limit values', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 999999;

      mockSearchRepository.findActiveRoles.mockResolvedValue(mockPaginatedResult);

      const result = await service.findActiveRoles(pagination);

      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle zero limit value', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 0;
      const emptyResult: PaginatedResult<Role> = {
        data: [],
        meta: { total: 2, page: 1, limit: 0, totalPages: Infinity, hasNext: false, hasPrev: false },
      };

      mockSearchRepository.findActiveRoles.mockResolvedValue(emptyResult);

      const result = await service.findActiveRoles(pagination);

      expect(result).toEqual(emptyResult);
    });
  });
});
