// Unified interfaces file for book-catalog module

import { HttpStatus } from '@nestjs/common';
import { BookCatalog } from './entities/book-catalog.entity';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';

// Re-export common types for convenience
export { PaginationDto, PaginatedResult };

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IBookCatalogCrudService {
  create(dto: any, userId: string): Promise<BookCatalog>;
  findAll(pagination: PaginationDto, userId: string): Promise<PaginatedResult<BookCatalog>>;
  findById(id: string, userId: string): Promise<BookCatalog>;
  update(id: string, dto: any, userId: string): Promise<BookCatalog>;
  softDelete(id: string, userId: string): Promise<void>;
}

export interface IBookCatalogSearchService {
  exactSearch(dto: any, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<BookCatalog>>;
  simpleFilter(term: string, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<BookCatalog>>;
  advancedFilter(filters: any, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<BookCatalog>>;
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

export interface IBookCatalogCrudRepository {
  createBook(dto: any, performedBy: string): Promise<BookCatalog>;
  getAllBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  getBookById(id: string): Promise<BookCatalog | null>;
  updateBook(id: string, dto: any, performedBy: string): Promise<BookCatalog>;
  deleteBook(id: string, performedBy?: string): Promise<void>;
}

export interface IBookCatalogSearchRepository {
  exactSearchBooks(searchDto: any): Promise<PaginatedResult<BookCatalog>>;
  simpleFilterBooks(term: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  findBooksWithFilters(filters: any, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  exportBooksToCsv(filters: any): Promise<string>;
}

// Re-export for backward compatibility
export { IBaseRepository };