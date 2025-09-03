// Unified interfaces file for book-genres module
import { HttpStatus } from '@nestjs/common';
import { BookGenre } from './entities/book-genre.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IBookGenreCrudService {
  createGenre: (params: any) => Promise<BookGenre>;
  getGenreById: (params: any) => Promise<BookGenre>;
  getAllGenres: (params: any) => Promise<PaginatedResult<BookGenre>>;
  updateGenre: (params: any) => Promise<BookGenre>;
  deleteGenre: (params: any) => Promise<{ id: string }>;
  // Controller compatibility methods
  create: (createDto: any, userId: string) => Promise<BookGenre>;
  findAll: (pagination: any, userId?: string) => Promise<PaginatedResult<BookGenre>>;
  findById: (id: string, userId?: string) => Promise<BookGenre>;
  update: (id: string, updateDto: any, userId: string) => Promise<BookGenre>;
  softDelete: (id: string, userId: string) => Promise<{ id: string }>;
}

export interface IBookGenreSearchService {
  exactSearch: (searchDto: any, pagination: any, userId?: string) => Promise<PaginatedResult<BookGenre>>;
  simpleFilter: (term: string, pagination: any, userId?: string) => Promise<PaginatedResult<BookGenre>>;
  advancedFilter: (filters: any, pagination: any, userId?: string) => Promise<PaginatedResult<BookGenre>>;
  exportToCsv: (filters?: any, res?: any, userId?: string) => Promise<string>;
  search: (searchTerm: string, pagination: any) => Promise<PaginatedResult<BookGenre>>;
  findWithFilters: (filters: any, pagination: any) => Promise<PaginatedResult<BookGenre>>;
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

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface IBookGenreCrudRepository extends IBaseRepository<BookGenre> {
  createGenre: (params: any) => Promise<BookGenre>;
  getGenreById: (params: any) => Promise<BookGenre | null>;
  getAllGenres: (params: any) => Promise<PaginatedResult<BookGenre>>;
  updateGenre: (params: any) => Promise<BookGenre>;
  deleteGenre: (params: any) => Promise<{ id: string }>;
  checkNameExists: (params: any) => Promise<boolean>;
}

export interface IBookGenreSearchRepository {
  searchByTerm: (searchTerm: string, pagination: any) => Promise<PaginatedResult<BookGenre>>;
  findWithFilters: (filters: any, pagination: any) => Promise<PaginatedResult<BookGenre>>;
  exportToCsv: (filters: any) => Promise<string>;
  exactSearchGenres: (searchDto: any, pagination: any) => Promise<PaginatedResult<BookGenre>>;
  simpleFilterGenres: (term: string, pagination: any) => Promise<PaginatedResult<BookGenre>>;
}

// ============================================================================
// PARAMETER INTERFACES
// ============================================================================

// Service parameter interfaces
export interface ICreateBookGenreServiceParams {
  createDto: any;
  userId: string;
}

export interface IGetAllBookGenresServiceParams {
  pagination: any;
  userId?: string;
}

export interface IGetBookGenreByIdServiceParams {
  id: string;
  userId?: string;
}

export interface IUpdateBookGenreServiceParams {
  id: string;
  updateDto: any;
  userId: string;
}

export interface IDeleteBookGenreServiceParams {
  id: string;
  userId: string;
}

// Repository parameter interfaces
export interface ICreateBookGenreParams {
  createDto: any;
  performedBy?: string;
}

export interface IGetBookGenreByIdParams {
  genreId: string;
}

export interface IGetAllBookGenresParams {
  pagination: any;
}

export interface IUpdateBookGenreParams {
  genreId: string;
  updateDto: any;
  performedBy?: string;
}

export interface IDeleteBookGenreParams {
  genreId: string;
  performedBy?: string;
}

export interface ICheckNameExistsParams {
  name: string;
  excludeId?: string;
}