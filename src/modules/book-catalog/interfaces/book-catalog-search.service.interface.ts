import { BookCatalog } from '../entities/book-catalog.entity';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { BookExactSearchDto } from '../dto/book-exact-search.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookCatalogSearchService {
  exactSearch(searchDto: BookExactSearchDto, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  simpleFilter(term: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  advancedFilter(
    filters: BookFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>>;
  findByGenre(genreId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>>;
  findByPublisher(
    publisherId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>>;
  exportToCsv(filters?: CsvExportFiltersDto): Promise<string>;
}
