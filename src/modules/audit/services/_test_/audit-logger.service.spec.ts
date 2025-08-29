import { Test, TestingModule } from '@nestjs/testing';
import { AuditLoggerService } from '../audit-logger.service';
import { IAuditLoggerRepository } from '../../interfaces/audit-logger.repository.interface';
import { AuditLog } from '../../entities/audit-log.entity';
import { AuditAction } from '../../enums/audit-action.enum';

describe('AuditLoggerService', () => {
  let service: AuditLoggerService;
  let auditLoggerRepository: IAuditLoggerRepository;

  const mockAuditLog: AuditLog = {
    id: '1',
    performedBy: 'user-1',
    entityId: 'entity-1',
    action: AuditAction.CREATE,
    details: 'User created a new book',
    entityType: 'Book',
    createdAt: new Date(),
  };

  const mockAuditLoggerRepository = {
    logUserAction: jest.fn(),
    logSystemAction: jest.fn(),
    logErrorAction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLoggerService,
        { provide: 'IAuditLoggerRepository', useValue: mockAuditLoggerRepository },
      ],
    }).compile();

    service = module.get<AuditLoggerService>(AuditLoggerService);
    auditLoggerRepository = module.get<IAuditLoggerRepository>('IAuditLoggerRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logOperation', () => {
    it('should log a user operation successfully', async () => {
      const performedBy = 'user-1';
      const entityId = 'entity-1';
      const action = AuditAction.CREATE;
      const details = 'User created a new book';
      const entityType = 'Book';

      mockAuditLoggerRepository.logUserAction.mockResolvedValue(mockAuditLog);

      const result = await service.logOperation(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );

      expect(auditLoggerRepository.logUserAction).toHaveBeenCalledWith(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );
      expect(result).toEqual(mockAuditLog);
    });

    it('should handle UPDATE action logging', async () => {
      const performedBy = 'user-2';
      const entityId = 'book-1';
      const action = AuditAction.UPDATE;
      const details = 'User updated book information';
      const entityType = 'BookCatalog';

      const updateAuditLog = {
        ...mockAuditLog,
        id: '2',
        performedBy,
        entityId,
        action,
        details,
        entityType,
      };

      mockAuditLoggerRepository.logUserAction.mockResolvedValue(updateAuditLog);

      const result = await service.logOperation(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );

      expect(auditLoggerRepository.logUserAction).toHaveBeenCalledWith(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );
      expect(result).toEqual(updateAuditLog);
    });

    it('should handle DELETE action logging', async () => {
      const performedBy = 'admin-1';
      const entityId = 'user-5';
      const action = AuditAction.DELETE;
      const details = 'Admin soft deleted user account';
      const entityType = 'User';

      const deleteAuditLog = {
        ...mockAuditLog,
        id: '3',
        performedBy,
        entityId,
        action,
        details,
        entityType,
      };

      mockAuditLoggerRepository.logUserAction.mockResolvedValue(deleteAuditLog);

      const result = await service.logOperation(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );

      expect(auditLoggerRepository.logUserAction).toHaveBeenCalledWith(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );
      expect(result).toEqual(deleteAuditLog);
    });

    it('should handle LOGIN action logging', async () => {
      const performedBy = 'user-3';
      const entityId = 'user-3';
      const action = AuditAction.LOGIN;
      const details = 'User successfully logged into the system';
      const entityType = 'User';

      const loginAuditLog = {
        ...mockAuditLog,
        id: '4',
        performedBy,
        entityId,
        action,
        details,
        entityType,
      };

      mockAuditLoggerRepository.logUserAction.mockResolvedValue(loginAuditLog);

      const result = await service.logOperation(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );

      expect(auditLoggerRepository.logUserAction).toHaveBeenCalledWith(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );
      expect(result).toEqual(loginAuditLog);
    });

    it('should handle REGISTER action logging', async () => {
      const performedBy = 'system';
      const entityId = 'user-6';
      const action = AuditAction.REGISTER;
      const details = 'New user registered in the system';
      const entityType = 'User';

      const registerAuditLog = {
        ...mockAuditLog,
        id: '5',
        performedBy,
        entityId,
        action,
        details,
        entityType,
      };

      mockAuditLoggerRepository.logUserAction.mockResolvedValue(registerAuditLog);

      const result = await service.logOperation(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );

      expect(auditLoggerRepository.logUserAction).toHaveBeenCalledWith(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );
      expect(result).toEqual(registerAuditLog);
    });

    it('should handle READ action logging', async () => {
      const performedBy = 'user-4';
      const entityId = 'book-2';
      const action = AuditAction.READ;
      const details = 'User viewed book details';
      const entityType = 'BookCatalog';

      const readAuditLog = {
        ...mockAuditLog,
        id: '6',
        performedBy,
        entityId,
        action,
        details,
        entityType,
      };

      mockAuditLoggerRepository.logUserAction.mockResolvedValue(readAuditLog);

      const result = await service.logOperation(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );

      expect(auditLoggerRepository.logUserAction).toHaveBeenCalledWith(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );
      expect(result).toEqual(readAuditLog);
    });

    it('should handle repository errors gracefully', async () => {
      const performedBy = 'user-1';
      const entityId = 'entity-1';
      const action = AuditAction.CREATE;
      const details = 'User created a new book';
      const entityType = 'Book';
      const error = new Error('Database connection failed');

      mockAuditLoggerRepository.logUserAction.mockRejectedValue(error);

      await expect(
        service.logOperation(performedBy, entityId, action, details, entityType),
      ).rejects.toThrow(error);

      expect(auditLoggerRepository.logUserAction).toHaveBeenCalledWith(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );
    });
  });

  describe('log', () => {
    it('should call logOperation with the same parameters', async () => {
      const performedBy = 'user-1';
      const entityId = 'entity-1';
      const action = AuditAction.CREATE;
      const details = 'User created a new book';
      const entityType = 'Book';

      mockAuditLoggerRepository.logUserAction.mockResolvedValue(mockAuditLog);

      const result = await service.log(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );

      expect(auditLoggerRepository.logUserAction).toHaveBeenCalledWith(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );
      expect(result).toEqual(mockAuditLog);
    });

    it('should propagate errors from logOperation', async () => {
      const performedBy = 'user-1';
      const entityId = 'entity-1';
      const action = AuditAction.CREATE;
      const details = 'User created a new book';
      const entityType = 'Book';
      const error = new Error('Audit logging failed');

      mockAuditLoggerRepository.logUserAction.mockRejectedValue(error);

      await expect(
        service.log(performedBy, entityId, action, details, entityType),
      ).rejects.toThrow(error);
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings in parameters', async () => {
      const performedBy = '';
      const entityId = '';
      const action = AuditAction.CREATE;
      const details = '';
      const entityType = '';

      const emptyAuditLog = {
        ...mockAuditLog,
        performedBy,
        entityId,
        details,
        entityType,
      };

      mockAuditLoggerRepository.logUserAction.mockResolvedValue(emptyAuditLog);

      const result = await service.logOperation(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );

      expect(auditLoggerRepository.logUserAction).toHaveBeenCalledWith(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );
      expect(result).toEqual(emptyAuditLog);
    });

    it('should handle very long details string', async () => {
      const performedBy = 'user-1';
      const entityId = 'entity-1';
      const action = AuditAction.UPDATE;
      const details = 'A'.repeat(1000); // Very long details string
      const entityType = 'Book';

      const longDetailsAuditLog = {
        ...mockAuditLog,
        action,
        details,
      };

      mockAuditLoggerRepository.logUserAction.mockResolvedValue(longDetailsAuditLog);

      const result = await service.logOperation(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );

      expect(auditLoggerRepository.logUserAction).toHaveBeenCalledWith(
        performedBy,
        entityId,
        action,
        details,
        entityType,
      );
      expect(result).toEqual(longDetailsAuditLog);
    });
  });
});