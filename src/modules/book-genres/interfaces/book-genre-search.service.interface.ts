import { BookGenre } from '../entities/book-genre.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BookGenreFiltersDto } from '../dto/book-genre-filters.dto';
import { BookGenreCsvExportFiltersDto } from '../dto/book-genre-csv-export-filters.dto';

export interface IBookGenreSearchService {
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
  filterSearch(filterTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
  findWithFilters(
    filters: BookGenreFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>>;
  exportToCsv(filters: BookGenreCsvExportFiltersDto): Promise<string>;

  // Methods needed by controller
  exactSearch(searchDto: any): Promise<PaginatedResult<BookGenre>>;
  simpleFilter(term: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
}
