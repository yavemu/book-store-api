import { BookCatalog } from '../entities/book-catalog.entity';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookCatalogSearchService {
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  filterSearch(
    filterTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>>;
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
  exportToCsv(filters?: CsvExportFiltersDto): Promise<string>;
}
