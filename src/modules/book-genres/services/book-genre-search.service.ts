import { Injectable, Inject } from '@nestjs/common';
import { IBookGenreSearchService } from '../interfaces/book-genre-search.service.interface';
import { IBookGenreSearchRepository } from '../interfaces/book-genre-search.repository.interface';
import { BookGenre } from '../entities/book-genre.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BookGenreFiltersDto } from '../dto/book-genre-filters.dto';
import { BookGenreCsvExportFiltersDto } from '../dto/book-genre-csv-export-filters.dto';
import { BookGenreExactSearchDto } from '../dto/book-genre-exact-search.dto';
import { BookGenreSimpleFilterDto } from '../dto/book-genre-simple-filter.dto';

@Injectable()
export class BookGenreSearchService implements IBookGenreSearchService {
  constructor(
    @Inject('IBookGenreSearchRepository')
    private readonly genreSearchRepository: IBookGenreSearchRepository,
  ) {}

  async exactSearch(searchDto: BookGenreExactSearchDto): Promise<PaginatedResult<BookGenre>> {
    return await this.genreSearchRepository.exactSearchGenres(searchDto);
  }

  async simpleFilter(filterDto: BookGenreSimpleFilterDto): Promise<PaginatedResult<BookGenre>> {
    return await this.genreSearchRepository.simpleFilterGenres(filterDto);
  }

  async findWithFilters(
    filters: BookGenreFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    return await this.genreSearchRepository.findWithFilters(filters, pagination);
  }

  async exportToCsv(filters: BookGenreCsvExportFiltersDto): Promise<string> {
    return await this.genreSearchRepository.exportToCsv(filters);
  }

  // Base methods needed by interface
  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>> {
    return await this.genreSearchRepository.searchGenres(searchTerm, pagination);
  }

  async filterSearch(
    filterTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    return await this.genreSearchRepository.filterGenres(filterTerm, pagination);
  }
}
