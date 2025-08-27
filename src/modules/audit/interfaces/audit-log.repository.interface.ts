import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IAuditLogRepository {
  // Public business logic methods
  logUserAction(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog>;
  
  getAuditTrail(pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getUserAuditHistory(userId: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getEntityAuditHistory(entityId: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getAuditsByAction(action: AuditAction, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getAuditsByEntityType(entityType: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  searchAuditLogs(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
}