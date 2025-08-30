import { BookAuthor } from '../entities/book-author.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BookAuthorFiltersDto } from '../dto/book-author-filters.dto';
import { BookAuthorCsvExportFiltersDto } from '../dto/book-author-csv-export-filters.dto';

export interface IBookAuthorSearchRepository {
  searchByTerm(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  findByNationality(
    nationality: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>>;
  findByFullName(firstName: string, lastName: string): Promise<BookAuthor | null>;
  findWithFilters(
    filters: BookAuthorFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>>;
  exportToCsv(filters: BookAuthorCsvExportFiltersDto): Promise<string>;
}
