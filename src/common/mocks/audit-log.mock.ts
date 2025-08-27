import { AuditLog, AuditAction } from '../../modules/audit/entities/audit-log.entity';

export class AuditLogMockFactory {
  static createOne(overrides?: Partial<AuditLog>): AuditLog {
    return {
      id: '987fcdeb-51d2-43e1-b789-123456789abc',
      performedBy: '123e4567-e89b-12d3-a456-426614174000',
      entityId: '123e4567-e89b-12d3-a456-426614174001',
      action: AuditAction.CREATE,
      details: 'Test audit log entry for testing purposes',
      entityType: 'User',
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      ...overrides,
    };
  }

  static createMany(count: number = 2, overrides?: Partial<AuditLog>): AuditLog[] {
    return Array.from({ length: count }, () => this.createOne(overrides));
  }

  static createUserAction(userId: string, overrides?: Partial<AuditLog>): AuditLog {
    return this.createOne({
      performedBy: userId,
      entityType: 'User',
      action: AuditAction.CREATE,
      details: `User ${userId} was created`,
      ...overrides,
    });
  }

  static createLoginAction(userId: string, overrides?: Partial<AuditLog>): AuditLog {
    return this.createOne({
      performedBy: userId,
      entityType: 'User',
      action: AuditAction.LOGIN,
      details: `User ${userId} logged in`,
      ...overrides,
    });
  }
}

export const auditLogMockData = {
  singleLog: AuditLogMockFactory.createOne(),
  multipleLogs: AuditLogMockFactory.createMany(5),
  userCreateLog: AuditLogMockFactory.createUserAction('user-123'),
  loginLog: AuditLogMockFactory.createLoginAction('user-123'),
};