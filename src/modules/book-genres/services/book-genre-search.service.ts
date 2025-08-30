import { Injectable, Inject } from '@nestjs/common';
import { IBookGenreSearchService } from '../interfaces/book-genre-search.service.interface';
import { IBookGenreSearchRepository } from '../interfaces/book-genre-search.repository.interface';
import { BookGenre } from '../entities/book-genre.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BookGenreFiltersDto } from '../dto/book-genre-filters.dto';
import { BookGenreCsvExportFiltersDto } from '../dto/book-genre-csv-export-filters.dto';

@Injectable()
export class BookGenreSearchService implements IBookGenreSearchService {
  constructor(
    @Inject('IBookGenreSearchRepository')
    private readonly genreSearchRepository: IBookGenreSearchRepository,
  ) {}

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>> {
    return await this.genreSearchRepository.searchGenres(searchTerm, pagination);
  }

  async filterSearch(
    filterTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    if (!filterTerm || filterTerm.trim().length < 3) {
      throw new Error('Filter term must be at least 3 characters long');
    }

    const trimmedTerm = filterTerm.trim();
    return await this.genreSearchRepository.filterGenres(trimmedTerm, pagination);
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
}
