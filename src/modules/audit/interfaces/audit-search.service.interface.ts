import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import {
  AuditFiltersDto,
  AuditExactSearchDto,
  AuditSimpleFilterDto,
  AuditCsvExportFiltersDto,
} from '../dto';

export interface IAuditSearchService {
  // Standardized search methods (following book-catalog pattern)
  exactSearch(searchDto: AuditExactSearchDto): Promise<PaginatedResult<AuditLog>>;
  simpleFilter(filterDto: AuditSimpleFilterDto): Promise<PaginatedResult<AuditLog>>;
  advancedFilter(
    filters: AuditFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>>;
  exportToCsv(filters?: AuditCsvExportFiltersDto): Promise<string>;

  // Legacy methods (maintained for backward compatibility)
  getAuditTrail(pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getAuditById(id: string): Promise<AuditLog>;
  filterSearch(filterTerm: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getUserAuditHistory(
    userId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>>;
  getEntityAuditHistory(
    entityId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>>;
  getAuditsByAction(
    action: AuditAction,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>>;
  getAuditsByEntityType(
    entityType: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>>;
  searchAuditLogs(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>>;
  findWithFilters(
    filters: AuditFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>>;
}
