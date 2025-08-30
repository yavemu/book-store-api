import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from '../audit.controller';
import { IAuditSearchService } from '../../interfaces/audit-search.service.interface';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { AuditAction } from '../../enums/audit-action.enum';
import { AuditFiltersDto } from '../../dto/audit-filters.dto';
import { AuditCsvExportFiltersDto } from '../../dto/audit-csv-export-filters.dto';

describe('AuditController', () => {
  let controller: AuditController;
  let auditSearchService: IAuditSearchService;

  const mockAuditSearchService = {
    getAuditTrail: jest.fn(),
    getAuditById: jest.fn(),
    searchAuditLogs: jest.fn(),
    filterSearch: jest.fn(),
    findWithFilters: jest.fn(),
    exportToCsv: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [{ provide: 'IAuditSearchService', useValue: mockAuditSearchService }],
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

  describe('findAll', () => {
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
        meta: { total: 1, page: 1, lastPage: 1 },
      };

      mockAuditSearchService.getAuditTrail.mockResolvedValue(mockAuditTrail);

      const result = await controller.findAll(pagination);

      expect(auditSearchService.getAuditTrail).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(mockAuditTrail);
    });
  });

  describe('findOne', () => {
    it('should get audit by id', async () => {
      const id = 'audit-1';
      const mockAudit = {
        id: 'audit-1',
        action: AuditAction.CREATE,
        entityType: 'Book',
        entityId: 'book-1',
        userId: 'user-1',
        timestamp: new Date(),
      };

      mockAuditSearchService.getAuditById.mockResolvedValue(mockAudit);

      const result = await controller.findOne(id);

      expect(auditSearchService.getAuditById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockAudit);
    });
  });

  describe('search', () => {
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
        meta: { total: 1, page: 1, lastPage: 1 },
      };

      mockAuditSearchService.searchAuditLogs.mockResolvedValue(mockSearchResults);

      const result = await controller.search(searchTerm, pagination);

      expect(auditSearchService.searchAuditLogs).toHaveBeenCalledWith(searchTerm, pagination);
      expect(result).toEqual(mockSearchResults);
    });
  });

  describe('filter', () => {
    it('should filter audits with query parameter', async () => {
      const filterTerm = 'book';
      const pagination = new PaginationDto();

      const mockFilterResults = {
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
        meta: { total: 1, page: 1, lastPage: 1 },
      };

      mockAuditSearchService.filterSearch.mockResolvedValue(mockFilterResults);

      const result = await controller.filter(filterTerm, pagination);

      expect(auditSearchService.filterSearch).toHaveBeenCalledWith(filterTerm, pagination);
      expect(result).toEqual(mockFilterResults);
    });
  });

  describe('exportToCsv', () => {
    it('should export audit logs to CSV', async () => {
      const filters = { entityType: 'Book' };
      const mockCsvData =
        'id,action,entityType,entityId,userId,timestamp\naudit-1,CREATE,Book,book-1,user-1,2023-01-01T00:00:00.000Z';
      const mockRes = {
        setHeader: jest.fn(),
        send: jest.fn(),
      };

      mockAuditSearchService.exportToCsv.mockResolvedValue(mockCsvData);

      await controller.exportToCsv(filters, mockRes as any);

      expect(auditSearchService.exportToCsv).toHaveBeenCalledWith(filters);
      expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        expect.stringContaining('attachment; filename='),
      );
      expect(mockRes.send).toHaveBeenCalledWith(mockCsvData);
    });
  });
});
