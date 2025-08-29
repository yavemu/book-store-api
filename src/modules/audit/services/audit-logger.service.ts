import { Injectable, Inject } from '@nestjs/common';
import { IAuditLoggerRepository } from '../interfaces/audit-logger.repository.interface';
import { IAuditLoggerService } from '../interfaces/audit-logger.service.interface';
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
    return await this.logOperation(
      performedBy,
      entityId,
      action,
      details,
      entityType,
    );
  }
}
