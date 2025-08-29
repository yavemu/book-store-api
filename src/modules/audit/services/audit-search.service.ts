import { Injectable, Inject } from '@nestjs/common';
import { IAuditSearchRepository } from '../interfaces/audit-search.repository.interface';
import { IAuditSearchService } from '../interfaces/audit-search.service.interface';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';

@Injectable()
export class AuditSearchService implements IAuditSearchService {
  constructor(
    @Inject('IAuditSearchRepository')
    private readonly auditSearchRepository: IAuditSearchRepository,
  ) {}

  async getAuditTrail(
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.getAuditTrail(pagination);
  }

  async getUserAuditHistory(
    userId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.getUserAuditHistory(
      userId,
      pagination,
    );
  }

  async getEntityAuditHistory(
    entityId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.getEntityAuditHistory(
      entityId,
      pagination,
    );
  }

  async getAuditsByAction(
    action: AuditAction,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.getAuditsByAction(
      action,
      pagination,
    );
  }

  async getAuditsByEntityType(
    entityType: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.getAuditsByEntityType(
      entityType,
      pagination,
    );
  }

  async searchAuditLogs(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.searchAuditLogs(
      searchTerm,
      pagination,
    );
  }
}
