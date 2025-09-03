import { Injectable, Inject } from '@nestjs/common';
import { IAuditLoggerRepository } from '../interfaces';
import {
  IAuditLoggerService,
  EnhancedAuditData,
} from '../interfaces';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';

@Injectable()
export class AuditLoggerService implements IAuditLoggerService {
  constructor(
    @Inject('IAuditLoggerRepository')
    private readonly auditLoggerRepository: IAuditLoggerRepository,
  ) {}

  async logOperation(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog> {
    return await this.auditLoggerRepository.logUserAction(
      performedBy,
      entityId,
      action,
      details,
      entityType,
    );
  }

  async log(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog> {
    return await this.logOperation(performedBy, entityId, action, details, entityType);
  }

  async logEnhanced(auditData: EnhancedAuditData): Promise<AuditLog> {
    // Agregar metadatos automáticamente si no están presentes
    const enhancedData = {
      ...auditData,
      result: auditData.result || 'SUCCESS',
      environment: auditData.environment || process.env.NODE_ENV || 'development',
      processId: auditData.processId || process.pid,
      executionContext: auditData.executionContext || 'Unknown',
    };

    return await this.auditLoggerRepository.logEnhancedAction(enhancedData);
  }

  async logError(
    performedBy: string,
    action: AuditAction,
    entityType: string,
    errorDetails: string,
    ipAddress?: string,
    executionContext?: string,
  ): Promise<AuditLog> {
    const auditData: EnhancedAuditData = {
      performedBy,
      entityId: null, // No hay entidad en caso de error
      action,
      details: `Error during ${action.toLowerCase()}: ${errorDetails}`,
      entityType,
      result: 'ERROR',
      ipAddress,
      executionContext,
      errorDetails,
      environment: process.env.NODE_ENV || 'development',
      processId: process.pid,
    };

    return await this.logEnhanced(auditData);
  }
}
