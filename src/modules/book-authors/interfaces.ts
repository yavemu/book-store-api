// Unified interfaces file for book-authors module
import { HttpStatus } from '@nestjs/common';
import { BookAuthor } from './entities/book-author.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';

// Basic interfaces to allow compilation
export interface IBookAuthorCrudService {
  createAuthor: (params: any) => Promise<BookAuthor>;
  getAuthorById: (params: any) => Promise<BookAuthor>;
  getAllAuthors: (params: any) => Promise<PaginatedResult<BookAuthor>>;
  updateAuthor: (params: any) => Promise<BookAuthor>;
  deleteAuthor: (params: any) => Promise<{ id: string }>;
  create: (createDto: any, userId: string) => Promise<BookAuthor>;
  findAll: (pagination: any, userId: string) => Promise<PaginatedResult<BookAuthor>>;
  findById: (id: string, userId: string) => Promise<BookAuthor>;
  update: (id: string, updateDto: any, userId: string) => Promise<BookAuthor>;
  softDelete: (id: string, userId: string) => Promise<{ id: string }>;
}

export interface IBookAuthorSearchService {
  exactSearch: (searchDto: any, pagination: any, userId?: string) => Promise<PaginatedResult<BookAuthor>>;
  simpleFilter: (term: string, pagination: any, userId?: string) => Promise<PaginatedResult<BookAuthor>>;
  advancedFilter: (filters: any, pagination: any, userId?: string) => Promise<PaginatedResult<BookAuthor>>;
  exportToCsv: (filters?: any, res?: any, userId?: string) => Promise<string>;
}

export interface IBookAuthorCrudRepository extends IBaseRepository<BookAuthor> {
  createAuthor: (params: any) => Promise<BookAuthor>;
  getAuthorById: (params: any) => Promise<BookAuthor | null>;
  getAllAuthors: (params: any) => Promise<PaginatedResult<BookAuthor>>;
  updateAuthor: (params: any) => Promise<BookAuthor>;
  deleteAuthor: (params: any) => Promise<{ id: string }>;
  checkEmailExists: (params: any) => Promise<boolean>;
  checkNameExists: (params: any) => Promise<boolean>;
}

export interface IBookAuthorSearchRepository {
  searchAuthorsExact: (searchDto: any, pagination: any) => Promise<PaginatedResult<BookAuthor>>;
  filterAuthorsSimple: (term: string, pagination: any) => Promise<PaginatedResult<BookAuthor>>;
  findAuthorsByName: (name: string, pagination: any) => Promise<PaginatedResult<BookAuthor>>;
  findAuthorsWithFilters: (filters: any, pagination: any) => Promise<PaginatedResult<BookAuthor>>;
  exportAuthorsToCsv: (filters: any) => Promise<string>;
  searchAuthorsByTerm: (searchTerm: string, pagination: any) => Promise<PaginatedResult<BookAuthor>>;
  findAuthorsByNationality: (nationality: string, pagination: any) => Promise<PaginatedResult<BookAuthor>>;
  findAuthorsByFullName: (firstName: string, lastName: string, pagination: any) => Promise<PaginatedResult<BookAuthor>>;
}

export interface IValidationService {
  validateUniqueConstraints: (dto: any, entityId?: string, constraints?: any[], repository?: any) => Promise<void>;
}

export interface IErrorHandlerService {
  handleError: (error: any, fallbackMessage: string, fallbackStatus?: HttpStatus) => never;
  createNotFoundException: (message: string) => never;
  createConflictException: (message: string) => never;
}

export interface IUserContextService {
  extractUserId: (request: any) => string;
  getCurrentUser: (request: any) => { id: string; [key: string]: any };
}

// Parameter interfaces
export interface ICreateBookAuthorServiceParams {
  createBookAuthorDto: any;
  userId: string;
  performedBy?: string;
}

export interface IGetAllBookAuthorsServiceParams {
  pagination: any;
  userId?: string;
}

export interface IGetBookAuthorByIdServiceParams {
  id: string;
  userId?: string;
}

export interface IUpdateBookAuthorServiceParams {
  id: string;
  updateBookAuthorDto: any;
  userId: string;
  performedBy?: string;
}

export interface IDeleteBookAuthorServiceParams {
  id: string;
  userId: string;
  performedBy?: string;
}

// Repository parameter interfaces
export interface ICreateBookAuthorParams {
  createBookAuthorDto: any;
  performedBy?: string;
}

export interface IGetBookAuthorByIdParams {
  authorId: string;
}

export interface IGetAllBookAuthorsParams {
  pagination: any;
}

export interface IUpdateBookAuthorParams {
  authorId: string;
  updateBookAuthorDto: any;
  performedBy?: string;
}

export interface IDeleteBookAuthorParams {
  authorId: string;
  performedBy?: string;
}

export interface ICheckEmailExistsParams {
  email: string;
  excludeId?: string;
}

export interface ICheckNameExistsParams {
  firstName: string;
  lastName: string;
  excludeId?: string;
}

// Validation repository interface
export interface IBookAuthorValidationRepository {
  checkEmailExists: (params: any) => Promise<boolean>;
  checkNameExists: (params: any) => Promise<boolean>;
}

// Re-export for backward compatibility
export { IBaseRepository };