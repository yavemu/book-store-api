import { BookAuthor } from '../entities/book-author.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import {
  BookAuthorFiltersDto,
  BookAuthorExactSearchDto,
  BookAuthorSimpleFilterDto,
  BookAuthorCsvExportFiltersDto,
} from '../dto';

export interface IBookAuthorSearchService {
  // Standardized search methods (following book-catalog pattern)
  exactSearch(searchDto: BookAuthorExactSearchDto): Promise<PaginatedResult<BookAuthor>>;
  simpleFilter(term: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  advancedFilter(
    filters: BookAuthorFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>>;
  exportToCsv(filters?: BookAuthorCsvExportFiltersDto): Promise<string>;

  // Legacy methods (maintained for backward compatibility)
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  findByFullName(
    firstName: string,
    lastName: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>>;
  findWithFilters(
    filters: BookAuthorFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>>;
}
