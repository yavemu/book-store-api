import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogRepository } from '../audit-log.repository';
import { AuditLog } from '../../entities/audit-log.entity';
import { AuditAction } from '../../enums/audit-action.enum';
import { PaginationDto } from '../../../../common/dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuditLogRepository', () => {
    let repository: AuditLogRepository;
    let auditLogRepo: Repository<AuditLog>;

    const mockAuditLogRepo = {
        create: jest.fn(),
        save: jest.fn(),
        findAndCount: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuditLogRepository,
                {
                    provide: getRepositoryToken(AuditLog),
                    useValue: mockAuditLogRepo,
                },
            ],
        }).compile();

        repository = module.get<AuditLogRepository>(AuditLogRepository);
        auditLogRepo = module.get<Repository<AuditLog>>(getRepositoryToken(AuditLog));
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('logUserAction', () => {
        it('should log a user action', async () => {
            const auditLog = new AuditLog();
            mockAuditLogRepo.create.mockReturnValue(auditLog);
            mockAuditLogRepo.save.mockResolvedValue(auditLog);
            const result = await repository.logUserAction('1', '1', AuditAction.CREATE, 'details', 'User');
            expect(result).toEqual(auditLog);
        });

        it('should throw http exception on error', async () => {
            mockAuditLogRepo.save.mockRejectedValue(new Error());
            await expect(repository.logUserAction('1', '1', AuditAction.CREATE, 'details', 'User')).rejects.toThrow(HttpException);
        });
    });

    describe('getAuditTrail', () => {
        it('should get audit trail', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockResolvedValue([[], 0]);
            await repository.getAuditTrail(pagination);
            expect(mockAuditLogRepo.findAndCount).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockRejectedValue(new Error());
            await expect(repository.getAuditTrail(pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getUserAuditHistory', () => {
        it('should get user audit history', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockResolvedValue([[], 0]);
            await repository.getUserAuditHistory('1', pagination);
            expect(mockAuditLogRepo.findAndCount).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockRejectedValue(new Error());
            await expect(repository.getUserAuditHistory('1', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getEntityAuditHistory', () => {
        it('should get entity audit history', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockResolvedValue([[], 0]);
            await repository.getEntityAuditHistory('1', pagination);
            expect(mockAuditLogRepo.findAndCount).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockRejectedValue(new Error());
            await expect(repository.getEntityAuditHistory('1', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getAuditsByAction', () => {
        it('should get audits by action', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockResolvedValue([[], 0]);
            await repository.getAuditsByAction(AuditAction.CREATE, pagination);
            expect(mockAuditLogRepo.findAndCount).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockRejectedValue(new Error());
            await expect(repository.getAuditsByAction(AuditAction.CREATE, pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getAuditsByEntityType', () => {
        it('should get audits by entity type', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockResolvedValue([[], 0]);
            await repository.getAuditsByEntityType('User', pagination);
            expect(mockAuditLogRepo.findAndCount).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockRejectedValue(new Error());
            await expect(repository.getAuditsByEntityType('User', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('searchAuditLogs', () => {
        it('should search audit logs', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockResolvedValue([[], 0]);
            await repository.searchAuditLogs('test', pagination);
            expect(mockAuditLogRepo.findAndCount).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            mockAuditLogRepo.findAndCount.mockRejectedValue(new Error());
            await expect(repository.searchAuditLogs('test', pagination)).rejects.toThrow(HttpException);
        });
    });
});
