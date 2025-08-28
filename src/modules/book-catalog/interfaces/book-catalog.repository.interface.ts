import { BookCatalog } from '../entities/book-catalog.entity';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { BookFiltersDto } from '../dto/book-filters.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

export interface IBookCatalogRepository {
  registerBook(
    createBookCatalogDto: CreateBookCatalogDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<BookCatalog>>;
  getBookProfile(bookId: string): Promise<SuccessResponseDto<BookCatalog>>;
  updateBookProfile(
    bookId: string,
    updateBookCatalogDto: UpdateBookCatalogDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<BookCatalog>>;
  deactivateBook(
    bookId: string,
    performedBy?: string,
  ): Promise<SuccessResponseDto<{ id: string }>>;
  searchBooks(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>>;
  getAllBooks(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>>;
  findBooksWithFilters(
    filters: BookFiltersDto,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>>;
  getBooksByGenre(
    genreId: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>>;
  getBooksByPublisher(
    publisherId: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>>;
  getAvailableBooks(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>>;
  checkIsbnExists(isbn: string): Promise<boolean>;
}