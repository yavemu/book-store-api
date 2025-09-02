import { BookCatalog } from '../entities/book-catalog.entity';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { BookExactSearchDto } from '../dto/book-exact-search.dto';
import { BookSimpleFilterDto } from '../dto/book-simple-filter.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookCatalogSearchRepository {
  exactSearchBooks(searchDto: BookExactSearchDto): Promise<PaginatedResult<BookCatalog>>;
  simpleFilterBooks(filterDto: BookSimpleFilterDto): Promise<PaginatedResult<BookCatalog>>;
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
