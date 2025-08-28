import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogService } from '../audit-log.service';
import { IAuditLogRepository } from '../../interfaces/audit-log.repository.interface';
import { AuditAction } from '../../enums/audit-action.enum';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { AuditLog } from '../../entities/audit-log.entity';

describe('AuditLogService', () => {
  let service: AuditLogService;
  let repository: IAuditLogRepository;

  const mockAuditLogRepository = {
    logUserAction: jest.fn(),
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
        AuditLogService,
        {
          provide: 'IAuditLogRepository',
          useValue: mockAuditLogRepository,
        },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
    repository = module.get<IAuditLogRepository>('IAuditLogRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logOperation', () => {
    it('should call repository.logUserAction with correct parameters', async () => {
      const params = {
        performedBy: 'user1',
        entityId: 'entity1',
        action: AuditAction.CREATE,
        details: 'details',
        entityType: 'entityType',
      };
      const auditLog = new AuditLog();
      mockAuditLogRepository.logUserAction.mockResolvedValue(auditLog);

      const result = await service.logOperation(
        params.performedBy,
        params.entityId,
        params.action,
        params.details,
        params.entityType,
      );

      expect(repository.logUserAction).toHaveBeenCalledWith(
        params.performedBy,
        params.entityId,
        params.action,
        params.details,
        params.entityType,
      );
      expect(result).toEqual(auditLog);
    });
  });

  describe('log', () => {
    it('should call logOperation with correct parameters', async () => {
        const params = {
            performedBy: 'user1',
            entityId: 'entity1',
            action: AuditAction.CREATE,
            details: 'details',
            entityType: 'entityType',
          };
          const auditLog = new AuditLog();
          mockAuditLogRepository.logUserAction.mockResolvedValue(auditLog);

          const result = await service.log(
            params.performedBy,
            params.entityId,
            params.action,
            params.details,
            params.entityType,
          );

          expect(repository.logUserAction).toHaveBeenCalledWith(
            params.performedBy,
            params.entityId,
            params.action,
            params.details,
            params.entityType,
          );
          expect(result).toEqual(auditLog);
    });
  });

  describe('getAuditTrail', () => {
    it('should call repository.getAuditTrail', async () => {
      const pagination: PaginationDto = { limit: 10, offset: 0 };
      await service.getAuditTrail(pagination);
      expect(repository.getAuditTrail).toHaveBeenCalledWith(pagination);
    });
  });

  describe('getUserAuditHistory', () => {
    it('should call repository.getUserAuditHistory', async () => {
      const userId = 'user1';
      const pagination: PaginationDto = { limit: 10, offset: 0 };
      await service.getUserAuditHistory(userId, pagination);
      expect(repository.getUserAuditHistory).toHaveBeenCalledWith(userId, pagination);
    });
  });

  describe('getEntityAuditHistory', () => {
    it('should call repository.getEntityAuditHistory', async () => {
        const entityId = 'entity1';
        const pagination: PaginationDto = { limit: 10, offset: 0 };
        await service.getEntityAuditHistory(entityId, pagination);
        expect(repository.getEntityAuditHistory).toHaveBeenCalledWith(entityId, pagination);
    });
  });

  describe('getAuditsByAction', () => {
    it('should call repository.getAuditsByAction', async () => {
        const action = AuditAction.CREATE;
        const pagination: PaginationDto = { limit: 10, offset: 0 };
        await service.getAuditsByAction(action, pagination);
        expect(repository.getAuditsByAction).toHaveBeenCalledWith(action, pagination);
    });
  });

  describe('getAuditsByEntityType', () => {
    it('should call repository.getAuditsByEntityType', async () => {
        const entityType = 'User';
        const pagination: PaginationDto = { limit: 10, offset: 0 };
        await service.getAuditsByEntityType(entityType, pagination);
        expect(repository.getAuditsByEntityType).toHaveBeenCalledWith(entityType, pagination);
    });
  });

  describe('searchAuditLogs', () => {
    it('should call repository.searchAuditLogs', async () => {
        const searchTerm = 'test';
        const pagination: PaginationDto = { limit: 10, offset: 0 };
        await service.searchAuditLogs(searchTerm, pagination);
        expect(repository.searchAuditLogs).toHaveBeenCalledWith(searchTerm, pagination);
    });
  });
});
