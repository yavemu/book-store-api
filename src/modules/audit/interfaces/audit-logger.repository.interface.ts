import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { EnhancedAuditData } from './audit-logger.service.interface';

export interface IAuditLoggerRepository {
  logUserAction(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog>;

  logEnhancedAction(auditData: EnhancedAuditData): Promise<AuditLog>;
}
