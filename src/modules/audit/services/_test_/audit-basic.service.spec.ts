import { Test, TestingModule } from '@nestjs/testing';
import { AuditLoggerService } from '../audit-logger.service';

describe('AuditLoggerService - Basic Tests', () => {
  let service: AuditLoggerService;

  beforeEach(async () => {
    const mockRepository = {
      createAuditLog: jest.fn().mockResolvedValue({}),
      getAuditLogs: jest.fn().mockResolvedValue({ data: [], meta: {} }),
      getAuditLogById: jest.fn().mockResolvedValue({}),
    };

    const mockErrorHandler = {
      handleError: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLoggerService,
        {
          provide: 'IAuditLoggerRepository',
          useValue: mockRepository,
        },
        {
          provide: 'IErrorHandlerService',
          useValue: mockErrorHandler,
        },
      ],
    }).compile();

    service = module.get<AuditLoggerService>(AuditLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});