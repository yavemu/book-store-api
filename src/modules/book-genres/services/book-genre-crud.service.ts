import { Injectable, Inject } from '@nestjs/common';
import { IBookGenreCrudService } from '../interfaces/book-genre-crud.service.interface';
import { IBookGenreCrudRepository } from '../interfaces/book-genre-crud.repository.interface';
import { BookGenre } from '../entities/book-genre.entity';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';

@Injectable()
export class BookGenreCrudService implements IBookGenreCrudService {
  constructor(
    @Inject('IBookGenreCrudRepository')
    private readonly genreCrudRepository: IBookGenreCrudRepository,
  ) {}

  async create(
    createBookGenreDto: CreateBookGenreDto,
    performedBy: string,
  ): Promise<BookGenre> {
    return await this.genreCrudRepository.registerGenre(
      createBookGenreDto,
      performedBy,
    );
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    return await this.genreCrudRepository.getAllGenres(pagination);
  }

  async findById(id: string): Promise<BookGenre> {
    return await this.genreCrudRepository.getGenreProfile(id);
  }

  async update(
    id: string,
    updateBookGenreDto: UpdateBookGenreDto,
    performedBy: string,
  ): Promise<BookGenre> {
    return await this.genreCrudRepository.updateGenreProfile(
      id,
      updateBookGenreDto,
      performedBy,
    );
  }

  async softDelete(
    id: string,
    performedBy: string,
  ): Promise<{ id: string }> {
    return await this.genreCrudRepository.deactivateGenre(id, performedBy);
  }
}
