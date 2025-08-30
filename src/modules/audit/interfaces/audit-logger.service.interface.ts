import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';

export interface EnhancedAuditData {
  performedBy: string;
  entityId?: string;
  action: AuditAction;
  details: string;
  entityType: string;
  result?: string;
  ipAddress?: string;
  environment?: string;
  processId?: number;
  executionContext?: string;
  entitySnapshot?: Record<string, any>;
  executionTimeMs?: number;
  errorDetails?: string;
}

export interface IAuditLoggerService {
  // Método original mantenido por compatibilidad
  logOperation(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog>;

  // Método original mantenido por compatibilidad
  log(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog>;

  // Nuevo método mejorado
  logEnhanced(auditData: EnhancedAuditData): Promise<AuditLog>;

  // Método conveniente para errores
  logError(
    performedBy: string,
    action: AuditAction,
    entityType: string,
    errorDetails: string,
    ipAddress?: string,
    executionContext?: string,
  ): Promise<AuditLog>;
}
