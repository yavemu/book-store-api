import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

export interface IAuditLogRepository {
  // Public business logic methods
  logUserAction(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<SuccessResponseDto<AuditLog>>;

  getAuditTrail(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>>;
  getUserAuditHistory(
    userId: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>>;
  getEntityAuditHistory(
    entityId: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>>;
  getAuditsByAction(
    action: AuditAction,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>>;
  getAuditsByEntityType(
    entityType: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>>;
  searchAuditLogs(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>>;
}