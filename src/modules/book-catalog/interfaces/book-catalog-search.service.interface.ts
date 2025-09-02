import { BookCatalog } from '../entities/book-catalog.entity';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { BookExactSearchDto } from '../dto/book-exact-search.dto';
import { BookSimpleFilterDto } from '../dto/book-simple-filter.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookCatalogSearchService {
  exactSearch(searchDto: BookExactSearchDto): Promise<PaginatedResult<BookCatalog>>;
  simpleFilter(filterDto: BookSimpleFilterDto): Promise<PaginatedResult<BookCatalog>>;
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
