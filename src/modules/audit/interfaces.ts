// Unified interfaces file for audit module
// This file contains all the interfaces needed by the audit module

import { HttpStatus } from '@nestjs/common';
import { AuditLog } from './entities/audit-log.entity';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { AuditAction } from './enums/audit-action.enum';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';

// ============================================================================
// DATA INTERFACES
// ============================================================================

export interface EnhancedAuditData {
  performedBy: string;
  entityId: string;
  action: AuditAction;
  details: string;
  entityType: string;
  result?: string;
  ipAddress?: string;
  environment?: string;
  processId?: number;
  executionContext?: string;
  entitySnapshot?: any;
  executionTimeMs?: number;
  errorDetails?: string;
}

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IAuditLoggerService {
  logOperation(performedBy: string, entityId: string, action: AuditAction, details: string, entityType: string): Promise<AuditLog>;
  log(performedBy: string, entityId: string, action: AuditAction, details: string, entityType: string): Promise<AuditLog>;
  logEnhanced(auditData: EnhancedAuditData): Promise<AuditLog>;
  logError(performedBy: string, action: AuditAction, entityType: string, errorDetails: string, ipAddress?: string, executionContext?: string): Promise<AuditLog>;
}

export interface IAuditSearchService {
  getAuditTrail(pagination: any): Promise<any>;
  exactSearch(searchDto: any): Promise<any>;
  simpleFilter(term: string, pagination: any): Promise<any>;
  getAuditById(id: string): Promise<any>;
  advancedFilter(filters: any, pagination: any): Promise<any>;
  exportToCsv(filters: any): Promise<any>;
  searchLogs(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  filterLogs(filters: any, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
}

export interface IValidationService {
  validateUniqueConstraints<T>(
    dto: Partial<T>,
    entityId?: string,
    constraints?: Array<{
      field: string | string[];
      message: string;
      transform?: (value: any) => any;
    }>,
    repository?: any,
  ): Promise<void>;
}

export interface IErrorHandlerService {
  handleError(error: any, fallbackMessage: string, fallbackStatus?: HttpStatus): never;
  createNotFoundException(message: string): never;
  createConflictException(message: string): never;
}

export interface IUserContextService {
  extractUserId(request: any): string;
  getCurrentUser(request: any): { id: string; [key: string]: any };
}

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface IAuditCrudRepository {
  getAllAuditLogs(pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getAuditLogById(id: string): Promise<AuditLog>;
  deleteAuditLog(id: string, performedBy?: string): Promise<void>;
  exportAuditLogsToCsv(filters: any, res: any): Promise<void>;
}

export interface IAuditSearchRepository {
  getAuditTrail(pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getUserAuditHistory(userId: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getEntityAuditHistory(entityId: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getAuditsByAction(action: AuditAction, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getAuditsByEntityType(entityType: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  searchAuditLogs(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  getAuditById(id: string): Promise<AuditLog>;
  filterAudits(filterTerm: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  findWithFilters(filters: any, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
  exportToCsv(filters?: any): Promise<string>;
  exactSearchAuditLogs(searchDto: any): Promise<PaginatedResult<AuditLog>>;
  simpleFilterAuditLogs(term: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>>;
}

export interface IAuditLoggerRepository {
  logUserAction(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog>;
  logEnhancedAction(auditData: EnhancedAuditData): Promise<AuditLog>;
}

// Re-export for backward compatibility
export { IBaseRepository };