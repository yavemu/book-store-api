import { BookCatalog } from '../entities/book-catalog.entity';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { BookExactSearchDto } from '../dto/book-exact-search.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookCatalogSearchRepository {
  exactSearchBooks(searchDto: BookExactSearchDto, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  simpleFilterBooks(term: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  advancedFilterBooks(
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
  getBooksForCsvExport(filters?: CsvExportFiltersDto): Promise<BookCatalog[]>;
}
