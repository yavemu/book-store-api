import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthService } from '../user-auth.service';
import { AuditAction } from '../../../audit/enums/audit-action.enum';

describe('UserAuthService', () => {
  let service: UserAuthService;
  let mockAuditLogService: any;

  beforeEach(async () => {
    mockAuditLogService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAuthService,
        {
          provide: 'IAuditLoggerService',
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    service = module.get<UserAuthService>(UserAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logLogin', () => {
    it('should call auditLogService.log with correct parameters', async () => {
      const userId = 'test-user-id';

      await service.logLogin(userId);

      expect(mockAuditLogService.log).toHaveBeenCalledWith(
        userId,
        userId,
        AuditAction.LOGIN,
        'User login successful',
        'User',
      );
      expect(mockAuditLogService.log).toHaveBeenCalledTimes(1);
    });

    it('should handle empty userId', async () => {
      const userId = '';

      await service.logLogin(userId);

      expect(mockAuditLogService.log).toHaveBeenCalledWith(
        '',
        '',
        AuditAction.LOGIN,
        'User login successful',
        'User',
      );
    });

    it('should handle null userId', async () => {
      const userId = null as any;

      await service.logLogin(userId);

      expect(mockAuditLogService.log).toHaveBeenCalledWith(
        null,
        null,
        AuditAction.LOGIN,
        'User login successful',
        'User',
      );
    });

    it('should handle undefined userId', async () => {
      const userId = undefined as any;

      await service.logLogin(userId);

      expect(mockAuditLogService.log).toHaveBeenCalledWith(
        undefined,
        undefined,
        AuditAction.LOGIN,
        'User login successful',
        'User',
      );
    });

    it('should propagate errors from auditLogService', async () => {
      const userId = 'test-user-id';
      const error = new Error('Audit log failed');
      
      mockAuditLogService.log.mockRejectedValue(error);

      await expect(service.logLogin(userId)).rejects.toThrow('Audit log failed');
      expect(mockAuditLogService.log).toHaveBeenCalledWith(
        userId,
        userId,
        AuditAction.LOGIN,
        'User login successful',
        'User',
      );
    });

    it('should use correct audit action LOGIN', async () => {
      const userId = 'test-user-id';

      await service.logLogin(userId);

      const callArgs = mockAuditLogService.log.mock.calls[0];
      expect(callArgs[2]).toBe(AuditAction.LOGIN);
    });

    it('should use correct message format', async () => {
      const userId = 'test-user-id';

      await service.logLogin(userId);

      const callArgs = mockAuditLogService.log.mock.calls[0];
      expect(callArgs[3]).toBe('User login successful');
    });

    it('should use correct entity type', async () => {
      const userId = 'test-user-id';

      await service.logLogin(userId);

      const callArgs = mockAuditLogService.log.mock.calls[0];
      expect(callArgs[4]).toBe('User');
    });

    it('should use userId as both actor and entity ID', async () => {
      const userId = 'test-user-id';

      await service.logLogin(userId);

      const callArgs = mockAuditLogService.log.mock.calls[0];
      expect(callArgs[0]).toBe(userId); // actorId
      expect(callArgs[1]).toBe(userId); // entityId
    });

    it('should work with different userId formats', async () => {
      const testCases = [
        'uuid-123-456-789',
        '12345',
        'user@example.com',
        'user-with-dashes',
        'user_with_underscores',
      ];

      for (const userId of testCases) {
        mockAuditLogService.log.mockClear();
        
        await service.logLogin(userId);

        expect(mockAuditLogService.log).toHaveBeenCalledWith(
          userId,
          userId,
          AuditAction.LOGIN,
          'User login successful',
          'User',
        );
      }
    });

    it('should return Promise<void>', async () => {
      const userId = 'test-user-id';

      const result = await service.logLogin(userId);

      expect(result).toBeUndefined();
    });
  });
});