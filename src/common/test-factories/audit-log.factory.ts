import { DeepPartial } from 'typeorm';
import { AuditLog } from '../../modules/audit/entities/audit-log.entity';
import { AuditAction } from '../../modules/audit/enums/audit-action.enum';
import { BaseFactory } from './base.factory';
import { UserFactory } from './user.factory';

/**
 * Factory for creating AuditLog entities for testing
 */
export class AuditLogFactory extends BaseFactory<AuditLog> {
  private userFactory = new UserFactory();

  create(overrides?: DeepPartial<AuditLog>): AuditLog {
    const now = this.generateTimestamp();
    const user = this.userFactory.create();

    const defaults: AuditLog = {
      id: this.generateUuid(),
      performedBy: user.id,
      entityId: this.generateUuid(),
      action: AuditAction.CREATE,
      details: 'Test audit log entry',
      entityType: 'TestEntity',
      result: 'SUCCESS',
      ipAddress: '192.168.1.1',
      environment: 'test',
      processId: 12345,
      executionContext: 'TestService',
      entitySnapshot: { id: this.generateUuid(), name: 'test entity' },
      executionTimeMs: 150,
      errorDetails: null,
      createdAt: now,
    };

    return this.mergeWithDefaults(defaults, overrides);
  }

  /**
   * Creates a CREATE action audit log
   */
  createCreateAction(
    entityType: string,
    entityId?: string,
    overrides?: DeepPartial<AuditLog>,
  ): AuditLog {
    return this.create({
      action: AuditAction.CREATE,
      entityType,
      entityId: entityId || this.generateUuid(),
      details: `Created new ${entityType}`,
      ...overrides,
    });
  }

  /**
   * Creates an UPDATE action audit log
   */
  createUpdateAction(
    entityType: string,
    entityId?: string,
    overrides?: DeepPartial<AuditLog>,
  ): AuditLog {
    return this.create({
      action: AuditAction.UPDATE,
      entityType,
      entityId: entityId || this.generateUuid(),
      details: `Updated ${entityType}`,
      ...overrides,
    });
  }

  /**
   * Creates a DELETE action audit log
   */
  createDeleteAction(
    entityType: string,
    entityId?: string,
    overrides?: DeepPartial<AuditLog>,
  ): AuditLog {
    return this.create({
      action: AuditAction.DELETE,
      entityType,
      entityId: entityId || this.generateUuid(),
      details: `Deleted ${entityType}`,
      ...overrides,
    });
  }

  /**
   * Creates a LOGIN action audit log
   */
  createLoginAction(userId?: string, overrides?: DeepPartial<AuditLog>): AuditLog {
    return this.create({
      action: AuditAction.LOGIN,
      entityType: 'User',
      entityId: userId || this.generateUuid(),
      performedBy: userId || this.generateUuid(),
      details: 'User logged in successfully',
      ...overrides,
    });
  }

  /**
   * Creates a REGISTER action audit log
   */
  createRegisterAction(userId?: string, overrides?: DeepPartial<AuditLog>): AuditLog {
    return this.create({
      action: AuditAction.REGISTER,
      entityType: 'User',
      entityId: userId || this.generateUuid(),
      performedBy: userId || this.generateUuid(),
      details: 'New user registered successfully',
      ...overrides,
    });
  }

  /**
   * Creates a failed operation audit log
   */
  createFailedAction(error: string, overrides?: DeepPartial<AuditLog>): AuditLog {
    return this.create({
      result: 'ERROR',
      errorDetails: error,
      details: `Operation failed: ${error}`,
      executionTimeMs: 50,
      ...overrides,
    });
  }

  /**
   * Creates an audit log for a specific user
   */
  createForUser(userId: string, overrides?: DeepPartial<AuditLog>): AuditLog {
    return this.create({
      performedBy: userId,
      ...overrides,
    });
  }

  /**
   * Creates an audit log with specific entity snapshot
   */
  createWithSnapshot(snapshot: Record<string, any>, overrides?: DeepPartial<AuditLog>): AuditLog {
    return this.create({
      entitySnapshot: snapshot,
      ...overrides,
    });
  }

  /**
   * Creates audit logs for performance testing
   */
  createPerformanceLog(executionTimeMs: number, overrides?: DeepPartial<AuditLog>): AuditLog {
    return this.create({
      executionTimeMs,
      details: `Operation completed in ${executionTimeMs}ms`,
      ...overrides,
    });
  }
}
