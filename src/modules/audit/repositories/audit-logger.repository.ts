import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { IAuditLoggerRepository } from '../interfaces/audit-logger.repository.interface';

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
    });
    return await this.auditLogRepository.save(auditLog);
  }
}
