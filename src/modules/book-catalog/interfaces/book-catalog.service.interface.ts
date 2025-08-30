import { BookCatalog } from '../entities/book-catalog.entity';
import { CreateBookCatalogDto } from '../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../dto/update-book-catalog.dto';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookCatalogService {
  create(createBookCatalogDto: CreateBookCatalogDto, performedBy: string): Promise<BookCatalog>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  findById(id: string): Promise<BookCatalog>;
  update(
    id: string,
    updateBookCatalogDto: UpdateBookCatalogDto,
    performedBy: string,
  ): Promise<BookCatalog>;
  softDelete(id: string, performedBy: string): Promise<void>;
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  findWithFilters(
    filters: BookFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>>;
  findByGenre(genreId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  findByPublisher(
    publisherId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>>;
  findAvailableBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  checkIsbnExists(isbn: string): Promise<{ exists: boolean }>;
}
