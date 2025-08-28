import { Injectable, Inject } from '@nestjs/common';
import { IBookGenreRepository } from '../interfaces/book-genre.repository.interface';
import { IBookGenreService } from '../interfaces/book-genre.service.interface';
import { BookGenre } from '../entities/book-genre.entity';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

@Injectable()
export class BookGenreService implements IBookGenreService {
  constructor(
    @Inject('IBookGenreRepository')
    private readonly genreRepository: IBookGenreRepository,
  ) {}

  async create(
    createBookGenreDto: CreateBookGenreDto,
    performedBy: string,
  ): Promise<SuccessResponseDto<BookGenre>> {
    return await this.genreRepository.registerGenre(
      createBookGenreDto,
      performedBy,
    );
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookGenre>>> {
    return await this.genreRepository.getAllGenres(pagination);
  }

  async findById(id: string): Promise<SuccessResponseDto<BookGenre>> {
    return await this.genreRepository.getGenreProfile(id);
  }

  async update(
    id: string,
    updateBookGenreDto: UpdateBookGenreDto,
    performedBy: string,
  ): Promise<SuccessResponseDto<BookGenre>> {
    return await this.genreRepository.updateGenreProfile(
      id,
      updateBookGenreDto,
      performedBy,
    );
  }

  async softDelete(
    id: string,
    performedBy: string,
  ): Promise<SuccessResponseDto<{ id: string }>> {
    return await this.genreRepository.deactivateGenre(id, performedBy);
  }

  async search(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookGenre>>> {
    return await this.genreRepository.searchGenres(searchTerm, pagination);
  }
}