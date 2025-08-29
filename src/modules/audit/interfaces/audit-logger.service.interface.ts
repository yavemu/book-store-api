import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';

export interface IAuditLoggerService {
  logOperation(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog>;
  log(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog>;
}
