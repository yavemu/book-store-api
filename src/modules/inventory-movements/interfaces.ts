// Unified interfaces file for inventory-movements module

import { HttpStatus } from '@nestjs/common';
import { InventoryMovement } from './entities/inventory-movement.entity';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';

// Re-export common types for convenience
export { PaginationDto, PaginatedResult };

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IInventoryMovementCrudService {
  create(dto: any, userId: string): Promise<InventoryMovement>;
  findAll(pagination: PaginationDto, userId: string): Promise<PaginatedResult<InventoryMovement>>;
  findById(id: string, userId: string): Promise<InventoryMovement>;
  update(id: string, dto: any, userId: string): Promise<InventoryMovement>;
  softDelete(id: string, userId: string): Promise<void>;
}

export interface IInventoryMovementSearchService {
  exactSearch(dto: any, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<InventoryMovement>>;
  simpleFilter(term: string, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<InventoryMovement>>;
  advancedFilter(filters: any, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<InventoryMovement>>;
  exportToCsv(filters?: any, res?: any, userId?: string): Promise<string>;
}

export interface IInventoryMovementTrackerService {
  trackMovement(movementData: any): Promise<InventoryMovement>;
  getMovementHistory(bookId: string, pagination: PaginationDto): Promise<PaginatedResult<InventoryMovement>>;
  calculateStock(bookId: string): Promise<number>;
}

export interface ITransactionService {
  processMovement(transactionData: any): Promise<void>;
  rollbackMovement(movementId: string): Promise<void>;
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

export interface IInventoryMovementCrudRepository {
  createMovement(dto: any, performedBy: string): Promise<InventoryMovement>;
  getAllMovements(pagination: PaginationDto): Promise<PaginatedResult<InventoryMovement>>;
  getMovementById(id: string): Promise<InventoryMovement | null>;
  updateMovement(id: string, dto: any, performedBy: string): Promise<InventoryMovement>;
  deleteMovement(id: string, performedBy?: string): Promise<void>;
}

export interface IInventoryMovementSearchRepository {
  exactSearchMovements(searchDto: any): Promise<PaginatedResult<InventoryMovement>>;
  simpleFilterMovements(term: string, pagination: PaginationDto, userId?: string, userRole?: string): Promise<PaginatedResult<InventoryMovement>>;
  findMovementsWithFilters(filters: any, pagination: PaginationDto): Promise<PaginatedResult<InventoryMovement>>;
  exportMovementsToCsv(filters: any): Promise<string>;
  getMovementsByBook(bookId: string, pagination: PaginationDto): Promise<PaginatedResult<InventoryMovement>>;
}

// Re-export for backward compatibility
export { IBaseRepository };