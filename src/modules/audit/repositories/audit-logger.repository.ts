import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { IAuditLoggerRepository } from '../interfaces';
import { EnhancedAuditData } from '../interfaces';
import { BaseAuditRepository } from '../../../common/repositories/base-audit.repository';

@Injectable()
export class AuditLoggerRepository
  extends BaseAuditRepository<AuditLog>
  implements IAuditLoggerRepository
{
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {
    super(auditLogRepository);
  }

  async logUserAction(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog> {
    const auditData = {
      performedBy,
      entityId,
      action,
      details,
      entityType,
      result: 'SUCCESS', // Default para compatibilidad hacia atrás
    };

    return await this._createWithoutAudit(auditData);
  }

  async logEnhancedAction(auditData: EnhancedAuditData): Promise<AuditLog> {
    const auditLogData = {
      performedBy: auditData.performedBy,
      entityId: auditData.entityId,
      action: auditData.action,
      details: auditData.details,
      entityType: auditData.entityType,
      result: auditData.result || 'SUCCESS',
      ipAddress: auditData.ipAddress,
      environment: auditData.environment,
      processId: auditData.processId,
      executionContext: auditData.executionContext,
      entitySnapshot: auditData.entitySnapshot,
      executionTimeMs: auditData.executionTimeMs,
      errorDetails: auditData.errorDetails,
    };

    return await this._createWithoutAudit(auditLogData);
  }
}
