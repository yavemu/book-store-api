import { Injectable, Inject } from '@nestjs/common';
import { IBookGenreSearchService } from '../interfaces/book-genre-search.service.interface';
import { IBookGenreSearchRepository } from '../interfaces/book-genre-search.repository.interface';
import { BookGenre } from '../entities/book-genre.entity';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';

@Injectable()
export class BookGenreSearchService implements IBookGenreSearchService {
  constructor(
    @Inject('IBookGenreSearchRepository')
    private readonly genreSearchRepository: IBookGenreSearchRepository,
  ) {}

  async search(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    return await this.genreSearchRepository.searchGenres(searchTerm, pagination);
  }
}
