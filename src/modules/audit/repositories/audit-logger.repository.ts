import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { IAuditLoggerRepository } from '../interfaces/audit-logger.repository.interface';
import { EnhancedAuditData } from '../interfaces/audit-logger.service.interface';

@Injectable()
export class AuditLoggerRepository implements IAuditLoggerRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async logUserAction(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      performedBy,
      entityId,
      action,
      details,
      entityType,
      result: 'SUCCESS', // Default para compatibilidad hacia atrás
    });
    return await this.auditLogRepository.save(auditLog);
  }

  async logEnhancedAction(auditData: EnhancedAuditData): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
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
    });

    return await this.auditLogRepository.save(auditLog);
  }
}
