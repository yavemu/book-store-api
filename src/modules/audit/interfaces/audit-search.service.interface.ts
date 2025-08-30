import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { AuditFiltersDto } from '../dto/audit-filters.dto';
import { AuditCsvExportFiltersDto } from '../dto/audit-csv-export-filters.dto';

export interface IAuditSearchService {
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
  exportToCsv(filters: AuditCsvExportFiltersDto): Promise<string>;
}
