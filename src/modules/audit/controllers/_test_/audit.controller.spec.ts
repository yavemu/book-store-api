import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from '../audit.controller';
import { IAuditSearchService } from '../../interfaces/audit-search.service.interface';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { AuditAction } from '../../enums/audit-action.enum';

describe('AuditController', () => {
  let controller: AuditController;
  let auditSearchService: IAuditSearchService;

  const mockAuditSearchService = {
    getAuditTrail: jest.fn(),
    getUserAuditHistory: jest.fn(),
    getEntityAuditHistory: jest.fn(),
    getAuditsByAction: jest.fn(),
    getAuditsByEntityType: jest.fn(),
    searchAuditLogs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        { provide: 'IAuditSearchService', useValue: mockAuditSearchService },
      ],
    }).compile();

    controller = module.get<AuditController>(AuditController);
    auditSearchService = module.get<IAuditSearchService>('IAuditSearchService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAuditTrail', () => {
    it('should get audit trail with pagination', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      
      const mockAuditTrail = {
        data: [
          {
            id: 'audit-1',
            action: AuditAction.CREATE,
            entityType: 'Book',
            entityId: 'book-1',
            userId: 'user-1',
            timestamp: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockAuditSearchService.getAuditTrail.mockResolvedValue(mockAuditTrail);

      const result = await controller.getAuditTrail(pagination);

      expect(auditSearchService.getAuditTrail).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(mockAuditTrail);
    });
  });

  describe('getUserAuditHistory', () => {
    it('should get user audit history', async () => {
      const userId = 'user-1';
      const pagination = new PaginationDto();
      
      const mockUserAuditHistory = {
        data: [
          {
            id: 'audit-1',
            action: AuditAction.CREATE,
            entityType: 'Book',
            entityId: 'book-1',
            userId: 'user-1',
            timestamp: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockAuditSearchService.getUserAuditHistory.mockResolvedValue(mockUserAuditHistory);

      const result = await controller.getUserAuditHistory(userId, pagination);

      expect(auditSearchService.getUserAuditHistory).toHaveBeenCalledWith(userId, pagination);
      expect(result).toEqual(mockUserAuditHistory);
    });
  });

  describe('getEntityAuditHistory', () => {
    it('should get entity audit history', async () => {
      const entityId = 'book-1';
      const pagination = new PaginationDto();
      
      const mockEntityAuditHistory = {
        data: [
          {
            id: 'audit-1',
            action: AuditAction.UPDATE,
            entityType: 'Book',
            entityId: 'book-1',
            userId: 'user-1',
            timestamp: new Date(),
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockAuditSearchService.getEntityAuditHistory.mockResolvedValue(mockEntityAuditHistory);

      const result = await controller.getEntityAuditHistory(entityId, pagination);

      expect(auditSearchService.getEntityAuditHistory).toHaveBeenCalledWith(entityId, pagination);
      expect(result).toEqual(mockEntityAuditHistory);
    });
  });

  describe('getAuditsByAction', () => {
    it('should get audits by action', async () => {
      const action = AuditAction.CREATE;
      const pagination = new PaginationDto();
      
      const mockAuditsByAction = {
        data: [
          {
            id: 'audit-1',
            action: AuditAction.CREATE,
            entityType: 'Book',
            entityId: 'book-1',
            userId: 'user-1',
            timestamp: new Date(),
          },
          {
            id: 'audit-2',
            action: AuditAction.CREATE,
            entityType: 'Author',
            entityId: 'author-1',
            userId: 'user-2',
            timestamp: new Date(),
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      mockAuditSearchService.getAuditsByAction.mockResolvedValue(mockAuditsByAction);

      const result = await controller.getAuditsByAction(action, pagination);

      expect(auditSearchService.getAuditsByAction).toHaveBeenCalledWith(action, pagination);
      expect(result).toEqual(mockAuditsByAction);
    });
  });

  describe('getAuditsByEntityType', () => {
    it('should get audits by entity type', async () => {
      const entityType = 'Book';
      const pagination = new PaginationDto();
      
      const mockAuditsByEntityType = {
        data: [
          {
            id: 'audit-1',
            action: AuditAction.CREATE,
            entityType: 'Book',
            entityId: 'book-1',
            userId: 'user-1',
            timestamp: new Date(),
          },
          {
            id: 'audit-2',
            action: AuditAction.UPDATE,
            entityType: 'Book',
            entityId: 'book-2',
            userId: 'user-1',
            timestamp: new Date(),
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      mockAuditSearchService.getAuditsByEntityType.mockResolvedValue(mockAuditsByEntityType);

      const result = await controller.getAuditsByEntityType(entityType, pagination);

      expect(auditSearchService.getAuditsByEntityType).toHaveBeenCalledWith(entityType, pagination);
      expect(result).toEqual(mockAuditsByEntityType);
    });
  });

  describe('searchAuditLogs', () => {
    it('should search audit logs', async () => {
      const searchTerm = 'book';
      const pagination = new PaginationDto();
      
      const mockSearchResults = {
        data: [
          {
            id: 'audit-1',
            action: AuditAction.CREATE,
            entityType: 'Book',
            entityId: 'book-1',
            userId: 'user-1',
            timestamp: new Date(),
            details: 'Created book with title containing "book"',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockAuditSearchService.searchAuditLogs.mockResolvedValue(mockSearchResults);

      const result = await controller.searchAuditLogs(searchTerm, pagination);

      expect(auditSearchService.searchAuditLogs).toHaveBeenCalledWith(searchTerm, pagination);
      expect(result).toEqual(mockSearchResults);
    });
  });
});