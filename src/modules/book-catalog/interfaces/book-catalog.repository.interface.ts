import { BookCatalog } from '../entities/book-catalog.entity';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { BookFiltersDto } from '../dto/book-filters.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';


export interface IBookCatalogRepository {
  registerBook(createBookCatalogDto: CreateBookCatalogDto, performedBy?: string): Promise<BookCatalog>;
  getBookProfile(bookId: string): Promise<BookCatalog>;
  updateBookProfile(bookId: string, updateBookCatalogDto: UpdateBookCatalogDto, performedBy?: string): Promise<BookCatalog>;
  deactivateBook(bookId: string, performedBy?: string): Promise<{ id: string }>;
  searchBooks(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  getAllBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  findBooksWithFilters(filters: BookFiltersDto, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  getBooksByGenre(genreId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  getBooksByPublisher(publisherId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  getAvailableBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  checkIsbnExists(isbn: string): Promise<boolean>;
}