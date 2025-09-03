// Unified interfaces file for book-author-assignments module

import { HttpStatus } from '@nestjs/common';
import { BookAuthorAssignment } from './entities/book-author-assignment.entity';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';

// Re-export common types for convenience
export { PaginationDto, PaginatedResult };

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IBookAuthorAssignmentCrudService {
  create(dto: any, performedBy: string): Promise<BookAuthorAssignment>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  findById(id: string): Promise<BookAuthorAssignment>;
  update(id: string, dto: any, performedBy: string): Promise<BookAuthorAssignment>;
  remove(id: string, performedBy?: string): Promise<void>;
}

export interface IBookAuthorAssignmentSearchService {
  exactSearch(dto: any, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<BookAuthorAssignment>>;
  simpleFilter(term: string, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<BookAuthorAssignment>>;
  advancedFilter(filters: any, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<BookAuthorAssignment>>;
  exportToCsv(filters: any, res?: any, userId?: string): Promise<string>;
  findByBook(bookId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  findByAuthor(authorId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
}

export interface IBookAuthorAssignmentService {
  create(dto: any, userId: string): Promise<BookAuthorAssignment>;
  findAll(pagination: PaginationDto, userId: string): Promise<PaginatedResult<BookAuthorAssignment>>;
  findById(id: string, userId: string): Promise<BookAuthorAssignment>;
  update(id: string, dto: any, userId: string): Promise<BookAuthorAssignment>;
  softDelete(id: string, userId: string): Promise<void>;
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

export interface IBookAuthorAssignmentCrudRepository {
  createAssignment(dto: any, performedBy: string): Promise<BookAuthorAssignment>;
  getAllAssignments(pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  getAssignmentProfile(assignmentId: string): Promise<BookAuthorAssignment>;
  updateAssignment(id: string, dto: any, performedBy: string): Promise<BookAuthorAssignment>;
  deactivateAssignment(assignmentId: string, performedBy?: string): Promise<{ id: string }>;
  checkAssignmentExists(bookId: string, authorId: string): Promise<boolean>;
}

export interface IBookAuthorAssignmentSearchRepository {
  exactSearchAssignments(searchDto: any): Promise<PaginatedResult<BookAuthorAssignment>>;
  simpleFilterAssignments(term: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  findWithFilters(filters: any, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  getAssignmentsByBook(bookId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  getAssignmentsByAuthor(authorId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  exportToCsv(filters: any): Promise<string>;
}

// Alias for backward compatibility - includes both crud and search methods
export interface IBookAuthorAssignmentRepository extends IBookAuthorAssignmentCrudRepository {
  getAssignmentsByBook(bookId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  getAssignmentsByAuthor(authorId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
}

// Re-export for backward compatibility
export { IBaseRepository };