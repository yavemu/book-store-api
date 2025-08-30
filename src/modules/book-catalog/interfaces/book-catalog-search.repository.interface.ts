import { BookCatalog } from '../entities/book-catalog.entity';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookCatalogSearchRepository {
  searchBooks(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  filterBooks(filterTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  findBooksWithFilters(
    filters: BookFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>>;
  getBooksByGenre(
    genreId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>>;
  getBooksByPublisher(
    publisherId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>>;
  getAvailableBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  checkIsbnExists(isbn: string): Promise<boolean>;
  getBooksForCsvExport(filters?: CsvExportFiltersDto): Promise<BookCatalog[]>;
}
