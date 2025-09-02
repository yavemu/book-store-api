import { Injectable, Inject } from '@nestjs/common';
import { IAuditSearchRepository } from '../interfaces/audit-search.repository.interface';
import { IAuditSearchService } from '../interfaces/audit-search.service.interface';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import {
  AuditFiltersDto,
  AuditExactSearchDto,
  AuditSimpleFilterDto,
  AuditCsvExportFiltersDto,
} from '../dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class AuditSearchService implements IAuditSearchService {
  constructor(
    @Inject('IAuditSearchRepository')
    private readonly auditSearchRepository: IAuditSearchRepository,
  ) {}

  async getAuditTrail(pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.getAuditTrail(pagination);
  }

  async getAuditById(id: string): Promise<AuditLog> {
    return await this.auditSearchRepository.getAuditById(id);
  }

  async filterSearch(
    filterTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    if (!filterTerm || filterTerm.trim().length < 3) {
      throw new Error('Filter term must be at least 3 characters long');
    }

    const trimmedTerm = filterTerm.trim();
    return await this.auditSearchRepository.filterAudits(trimmedTerm, pagination);
  }

  async getUserAuditHistory(
    userId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.getUserAuditHistory(userId, pagination);
  }

  async getEntityAuditHistory(
    entityId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.getEntityAuditHistory(entityId, pagination);
  }

  async getAuditsByAction(
    action: AuditAction,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.getAuditsByAction(action, pagination);
  }

  async getAuditsByEntityType(
    entityType: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.getAuditsByEntityType(entityType, pagination);
  }

  async searchAuditLogs(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.searchAuditLogs(searchTerm, pagination);
  }

  async findWithFilters(
    filters: AuditFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    return await this.auditSearchRepository.findWithFilters(filters, pagination);
  }

  async exportToCsv(filters?: AuditCsvExportFiltersDto): Promise<string> {
    return await this.auditSearchRepository.exportToCsv(filters);
  }

  // Standardized search methods (following book-catalog pattern)
  async exactSearch(searchDto: AuditExactSearchDto): Promise<PaginatedResult<AuditLog>> {
    // Implementation will delegate to existing repository methods
    return await this.auditSearchRepository.exactSearchAuditLogs(searchDto);
  }

  async simpleFilter(filterDto: AuditSimpleFilterDto): Promise<PaginatedResult<AuditLog>> {
    // Implementation will delegate to existing repository methods
    return await this.auditSearchRepository.simpleFilterAuditLogs(filterDto);
  }

  async advancedFilter(
    filters: AuditFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    // Delegate to existing method
    return await this.findWithFilters(filters, pagination);
  }
}
