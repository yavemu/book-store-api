// Unified interfaces file for roles module

import { HttpStatus } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';

// Re-export common types for convenience
export { PaginationDto, PaginatedResult };

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IRoleCrudService {
  create(dto: any, userId: string): Promise<Role>;
  findAll(pagination: PaginationDto, userId: string): Promise<PaginatedResult<Role>>;
  findById(id: string, userId: string): Promise<Role>;
  update(id: string, dto: any, userId: string): Promise<Role>;
  softDelete(id: string, userId: string): Promise<void>;
}

export interface IRoleSearchService {
  exactSearch(dto: any, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<Role>>;
  simpleFilter(term: string, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<Role>>;
  advancedFilter(filters: any, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<Role>>;
  exportToCsv(filters?: any, res?: any, userId?: string): Promise<string>;
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

export interface IRoleCrudRepository {
  createRole(dto: any, performedBy: string): Promise<Role>;
  getAllRoles(pagination: PaginationDto): Promise<PaginatedResult<Role>>;
  getRoleById(id: string): Promise<Role | null>;
  updateRole(id: string, dto: any, performedBy: string): Promise<Role>;
  deleteRole(id: string, performedBy?: string): Promise<void>;
}

export interface IRoleSearchRepository {
  exactSearchRoles(searchDto: any): Promise<PaginatedResult<Role>>;
  simpleFilterRoles(term: string, pagination: PaginationDto): Promise<PaginatedResult<Role>>;
  findRolesWithFilters(filters: any, pagination: PaginationDto): Promise<PaginatedResult<Role>>;
  exportRolesToCsv(filters: any): Promise<string>;
}

export interface IRoleValidationRepository {
  checkRoleNameExists(name: string, excludeId?: string): Promise<boolean>;
  checkRoleCodeExists(code: string, excludeId?: string): Promise<boolean>;
}

// Re-export for backward compatibility
export { IBaseRepository };