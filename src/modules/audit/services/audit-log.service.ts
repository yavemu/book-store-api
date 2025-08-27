import { Injectable, Inject } from '@nestjs/common';
import { IAuditLogRepository } from '../interfaces/audit-log.repository.interface';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @Inject('IAuditLogRepository')
    private readonly auditLogRepository: IAuditLogRepository,
  ) {}

  async logOperation(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog> {
    return this.auditLogRepository.logUserAction(
      performedBy,
      entityId,
      action,
      details,
      entityType,
    );
  }

  async getAuditTrail(pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    return this.auditLogRepository.getAuditTrail(pagination);
  }

  async getUserAuditHistory(userId: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    return this.auditLogRepository.getUserAuditHistory(userId, pagination);
  }

  async getEntityAuditHistory(entityId: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    return this.auditLogRepository.getEntityAuditHistory(entityId, pagination);
  }

  async getAuditsByAction(action: AuditAction, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    return this.auditLogRepository.getAuditsByAction(action, pagination);
  }

  async getAuditsByEntityType(entityType: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    return this.auditLogRepository.getAuditsByEntityType(entityType, pagination);
  }

  async searchAuditLogs(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    return this.auditLogRepository.searchAuditLogs(searchTerm, pagination);
  }
}