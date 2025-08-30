import { Test, TestingModule } from '@nestjs/testing';
import { AuditSearchService } from '../audit-search.service';
import { IAuditSearchRepository } from '../../interfaces/audit-search.repository.interface';
import { AuditLog } from '../../entities/audit-log.entity';
import { AuditAction } from '../../enums/audit-action.enum';
import { PaginationDto, PaginatedResult } from '../../../../common/dto/pagination.dto';

describe('AuditSearchService', () => {
  let service: AuditSearchService;
  let auditSearchRepository: IAuditSearchRepository;

  const mockAuditLog: AuditLog = {
    id: '1',
    performedBy: 'user-1',
    entityId: 'entity-1',
    action: AuditAction.CREATE,
    details: 'User created a new book',
    entityType: 'Book',
    result: 'SUCCESS',
    ipAddress: '127.0.0.1',
    environment: 'test',
    processId: 1234,
    executionContext: 'TestService',
    entitySnapshot: null,
    executionTimeMs: 10,
    errorDetails: null,
    createdAt: new Date(),
  };

  const mockAuditLog2: AuditLog = {
    id: '2',
    performedBy: 'user-2',
    entityId: 'entity-2',
    action: AuditAction.UPDATE,
    details: 'User updated book information',
    entityType: 'Book',
    result: 'SUCCESS',
    ipAddress: '127.0.0.1',
    environment: 'test',
    processId: 1234,
    executionContext: 'TestService',
    entitySnapshot: null,
    executionTimeMs: 10,
    errorDetails: null,
    createdAt: new Date(),
  };

  const mockPaginatedResult: PaginatedResult<AuditLog> = {
    data: [mockAuditLog, mockAuditLog2],
    meta: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };

  const mockAuditSearchRepository = {
    getAuditTrail: jest.fn(),
    getUserAuditHistory: jest.fn(),
    getEntityAuditHistory: jest.fn(),
    getAuditsByAction: jest.fn(),
    getAuditsByEntityType: jest.fn(),
    searchAuditLogs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditSearchService,
        { provide: 'IAuditSearchRepository', useValue: mockAuditSearchRepository },
      ],
    }).compile();

    service = module.get<AuditSearchService>(AuditSearchService);
    auditSearchRepository = module.get<IAuditSearchRepository>('IAuditSearchRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuditTrail', () => {
    it('should return paginated audit trail', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockAuditSearchRepository.getAuditTrail.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAuditTrail(pagination);

      expect(auditSearchRepository.getAuditTrail).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle empty audit trail', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<AuditLog> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockAuditSearchRepository.getAuditTrail.mockResolvedValue(emptyResult);

      const result = await service.getAuditTrail(pagination);

      expect(auditSearchRepository.getAuditTrail).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(emptyResult);
    });

    it('should handle repository errors', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const error = new Error('Database connection failed');

      mockAuditSearchRepository.getAuditTrail.mockRejectedValue(error);

      await expect(service.getAuditTrail(pagination)).rejects.toThrow(error);
    });
  });

  describe('getUserAuditHistory', () => {
    it('should return user audit history', async () => {
      const userId = 'user-1';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockAuditSearchRepository.getUserAuditHistory.mockResolvedValue(mockPaginatedResult);

      const result = await service.getUserAuditHistory(userId, pagination);

      expect(auditSearchRepository.getUserAuditHistory).toHaveBeenCalledWith(userId, pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle non-existent user', async () => {
      const userId = 'non-existent-user';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<AuditLog> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockAuditSearchRepository.getUserAuditHistory.mockResolvedValue(emptyResult);

      const result = await service.getUserAuditHistory(userId, pagination);

      expect(auditSearchRepository.getUserAuditHistory).toHaveBeenCalledWith(userId, pagination);
      expect(result).toEqual(emptyResult);
    });

    it('should handle repository errors during user history retrieval', async () => {
      const userId = 'user-1';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const error = new Error('Failed to retrieve user audit history');

      mockAuditSearchRepository.getUserAuditHistory.mockRejectedValue(error);

      await expect(service.getUserAuditHistory(userId, pagination)).rejects.toThrow(error);
    });
  });

  describe('getEntityAuditHistory', () => {
    it('should return entity audit history', async () => {
      const entityId = 'entity-1';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockAuditSearchRepository.getEntityAuditHistory.mockResolvedValue(mockPaginatedResult);

      const result = await service.getEntityAuditHistory(entityId, pagination);

      expect(auditSearchRepository.getEntityAuditHistory).toHaveBeenCalledWith(
        entityId,
        pagination,
      );
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle entity with no audit history', async () => {
      const entityId = 'new-entity';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<AuditLog> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockAuditSearchRepository.getEntityAuditHistory.mockResolvedValue(emptyResult);

      const result = await service.getEntityAuditHistory(entityId, pagination);

      expect(auditSearchRepository.getEntityAuditHistory).toHaveBeenCalledWith(
        entityId,
        pagination,
      );
      expect(result).toEqual(emptyResult);
    });
  });

  describe('getAuditsByAction', () => {
    it('should return audits filtered by CREATE action', async () => {
      const action = AuditAction.CREATE;
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const createAudits: PaginatedResult<AuditLog> = {
        data: [mockAuditLog],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false },
      };

      mockAuditSearchRepository.getAuditsByAction.mockResolvedValue(createAudits);

      const result = await service.getAuditsByAction(action, pagination);

      expect(auditSearchRepository.getAuditsByAction).toHaveBeenCalledWith(action, pagination);
      expect(result).toEqual(createAudits);
    });

    it('should return audits filtered by UPDATE action', async () => {
      const action = AuditAction.UPDATE;
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const updateAudits: PaginatedResult<AuditLog> = {
        data: [mockAuditLog2],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false },
      };

      mockAuditSearchRepository.getAuditsByAction.mockResolvedValue(updateAudits);

      const result = await service.getAuditsByAction(action, pagination);

      expect(auditSearchRepository.getAuditsByAction).toHaveBeenCalledWith(action, pagination);
      expect(result).toEqual(updateAudits);
    });

    it('should handle DELETE action filtering', async () => {
      const action = AuditAction.DELETE;
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const deleteAudit: AuditLog = {
        ...mockAuditLog,
        id: '3',
        action: AuditAction.DELETE,
        details: 'User deleted book',
      };
      const deleteAudits: PaginatedResult<AuditLog> = {
        data: [deleteAudit],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false },
      };

      mockAuditSearchRepository.getAuditsByAction.mockResolvedValue(deleteAudits);

      const result = await service.getAuditsByAction(action, pagination);

      expect(auditSearchRepository.getAuditsByAction).toHaveBeenCalledWith(action, pagination);
      expect(result).toEqual(deleteAudits);
    });

    it('should handle LOGIN action filtering', async () => {
      const action = AuditAction.LOGIN;
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const loginAudit: AuditLog = {
        ...mockAuditLog,
        id: '4',
        action: AuditAction.LOGIN,
        details: 'User logged in',
        entityType: 'User',
      };
      const loginAudits: PaginatedResult<AuditLog> = {
        data: [loginAudit],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false },
      };

      mockAuditSearchRepository.getAuditsByAction.mockResolvedValue(loginAudits);

      const result = await service.getAuditsByAction(action, pagination);

      expect(auditSearchRepository.getAuditsByAction).toHaveBeenCalledWith(action, pagination);
      expect(result).toEqual(loginAudits);
    });
  });

  describe('getAuditsByEntityType', () => {
    it('should return audits filtered by entity type', async () => {
      const entityType = 'Book';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockAuditSearchRepository.getAuditsByEntityType.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAuditsByEntityType(entityType, pagination);

      expect(auditSearchRepository.getAuditsByEntityType).toHaveBeenCalledWith(
        entityType,
        pagination,
      );
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle User entity type filtering', async () => {
      const entityType = 'User';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const userAudit: AuditLog = {
        ...mockAuditLog,
        id: '5',
        entityType: 'User',
        details: 'User account updated',
      };
      const userAudits: PaginatedResult<AuditLog> = {
        data: [userAudit],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1, hasNext: false, hasPrev: false },
      };

      mockAuditSearchRepository.getAuditsByEntityType.mockResolvedValue(userAudits);

      const result = await service.getAuditsByEntityType(entityType, pagination);

      expect(auditSearchRepository.getAuditsByEntityType).toHaveBeenCalledWith(
        entityType,
        pagination,
      );
      expect(result).toEqual(userAudits);
    });

    it('should handle unknown entity type', async () => {
      const entityType = 'UnknownEntity';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<AuditLog> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockAuditSearchRepository.getAuditsByEntityType.mockResolvedValue(emptyResult);

      const result = await service.getAuditsByEntityType(entityType, pagination);

      expect(auditSearchRepository.getAuditsByEntityType).toHaveBeenCalledWith(
        entityType,
        pagination,
      );
      expect(result).toEqual(emptyResult);
    });
  });

  describe('searchAuditLogs', () => {
    it('should search audit logs by term', async () => {
      const searchTerm = 'book';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockAuditSearchRepository.searchAuditLogs.mockResolvedValue(mockPaginatedResult);

      const result = await service.searchAuditLogs(searchTerm, pagination);

      expect(auditSearchRepository.searchAuditLogs).toHaveBeenCalledWith(searchTerm, pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle empty search term', async () => {
      const searchTerm = '';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      mockAuditSearchRepository.searchAuditLogs.mockResolvedValue(mockPaginatedResult);

      const result = await service.searchAuditLogs(searchTerm, pagination);

      expect(auditSearchRepository.searchAuditLogs).toHaveBeenCalledWith(searchTerm, pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle search with no results', async () => {
      const searchTerm = 'nonexistent';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<AuditLog> = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockAuditSearchRepository.searchAuditLogs.mockResolvedValue(emptyResult);

      const result = await service.searchAuditLogs(searchTerm, pagination);

      expect(auditSearchRepository.searchAuditLogs).toHaveBeenCalledWith(searchTerm, pagination);
      expect(result).toEqual(emptyResult);
    });

    it('should handle repository errors during search', async () => {
      const searchTerm = 'book';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      const error = new Error('Search service unavailable');

      mockAuditSearchRepository.searchAuditLogs.mockRejectedValue(error);

      await expect(service.searchAuditLogs(searchTerm, pagination)).rejects.toThrow(error);
    });
  });

  describe('pagination scenarios', () => {
    it('should handle large page numbers', async () => {
      const pagination = new PaginationDto();
      pagination.page = 999;
      pagination.limit = 10;
      const emptyResult: PaginatedResult<AuditLog> = {
        data: [],
        meta: { total: 50, page: 999, limit: 10, totalPages: 5, hasNext: false, hasPrev: true },
      };

      mockAuditSearchRepository.getAuditTrail.mockResolvedValue(emptyResult);

      const result = await service.getAuditTrail(pagination);

      expect(result).toEqual(emptyResult);
    });

    it('should handle large limit values', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 1000;

      mockAuditSearchRepository.getAuditTrail.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAuditTrail(pagination);

      expect(auditSearchRepository.getAuditTrail).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(mockPaginatedResult);
    });

    it('should handle zero page number', async () => {
      const pagination = new PaginationDto();
      pagination.page = 0;
      pagination.limit = 10;

      mockAuditSearchRepository.getAuditTrail.mockResolvedValue(mockPaginatedResult);

      const result = await service.getAuditTrail(pagination);

      expect(auditSearchRepository.getAuditTrail).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(mockPaginatedResult);
    });
  });
});
