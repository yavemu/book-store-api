import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from '../audit.controller';
import { IAuditLogService } from '../interfaces/audit-log.service.interface';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { AuditAction } from '../enums/audit-action.enum';

describe('AuditController', () => {
    let controller: AuditController;
    let service: IAuditLogService;

    const mockAuditLogService = {
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
                {
                    provide: 'IAuditLogService',
                    useValue: mockAuditLogService,
                },
            ],
        }).compile();

        controller = module.get<AuditController>(AuditController);
        service = module.get<IAuditLogService>('IAuditLogService');
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAuditTrail', () => {
        it('should get audit trail', async () => {
            const pagination = new PaginationDto();
            await controller.getAuditTrail(pagination);
            expect(service.getAuditTrail).toHaveBeenCalledWith(pagination);
        });
    });

    describe('getUserAuditHistory', () => {
        it('should get user audit history', async () => {
            const pagination = new PaginationDto();
            await controller.getUserAuditHistory('1', pagination);
            expect(service.getUserAuditHistory).toHaveBeenCalledWith('1', pagination);
        });
    });

    describe('getEntityAuditHistory', () => {
        it('should get entity audit history', async () => {
            const pagination = new PaginationDto();
            await controller.getEntityAuditHistory('1', pagination);
            expect(service.getEntityAuditHistory).toHaveBeenCalledWith('1', pagination);
        });
    });

    describe('getAuditsByAction', () => {
        it('should get audits by action', async () => {
            const pagination = new PaginationDto();
            await controller.getAuditsByAction(AuditAction.CREATE, pagination);
            expect(service.getAuditsByAction).toHaveBeenCalledWith(AuditAction.CREATE, pagination);
        });
    });

    describe('getAuditsByEntityType', () => {
        it('should get audits by entity type', async () => {
            const pagination = new PaginationDto();
            await controller.getAuditsByEntityType('User', pagination);
            expect(service.getAuditsByEntityType).toHaveBeenCalledWith('User', pagination);
        });
    });

    describe('searchAuditLogs', () => {
        it('should search audit logs', async () => {
            const pagination = new PaginationDto();
            await controller.searchAuditLogs('test', pagination);
            expect(service.searchAuditLogs).toHaveBeenCalledWith('test', pagination);
        });
    });
});
