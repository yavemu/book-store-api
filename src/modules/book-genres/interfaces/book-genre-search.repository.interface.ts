import { BookGenre } from '../entities/book-genre.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BookGenreFiltersDto } from '../dto/book-genre-filters.dto';
import { BookGenreCsvExportFiltersDto } from '../dto/book-genre-csv-export-filters.dto';

export interface IBookGenreSearchRepository {
  searchGenres(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
  filterGenres(filterTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
  checkNameExists(name: string): Promise<boolean>;
  findWithFilters(
    filters: BookGenreFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>>;
  exportToCsv(filters: BookGenreCsvExportFiltersDto): Promise<string>;

  // Methods needed by service
  exactSearchGenres(searchDto: any): Promise<PaginatedResult<BookGenre>>;
  simpleFilterGenres(filterDto: any): Promise<PaginatedResult<BookGenre>>;
}
