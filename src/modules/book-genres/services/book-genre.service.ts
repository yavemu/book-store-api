import { Injectable, Inject } from '@nestjs/common';
import { IBookGenreRepository } from '../interfaces/book-genre.repository.interface';
import { IBookGenreService } from '../interfaces/book-genre.service.interface';
import { BookGenre } from '../entities/book-genre.entity';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class BookGenreService implements IBookGenreService {
  constructor(
    @Inject('IBookGenreRepository')
    private readonly genreRepository: IBookGenreRepository,
  ) {}

  async create(createBookGenreDto: CreateBookGenreDto, performedBy: string): Promise<BookGenre> {
    return await this.genreRepository.registerGenre(createBookGenreDto, performedBy);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookGenre>> {
    return await this.genreRepository.getAllGenres(pagination);
  }

  async findById(id: string): Promise<BookGenre> {
    return await this.genreRepository.getGenreProfile(id);
  }

  async update(id: string, updateBookGenreDto: UpdateBookGenreDto, performedBy: string): Promise<BookGenre> {
    return await this.genreRepository.updateGenreProfile(id, updateBookGenreDto, performedBy);
  }

  async softDelete(id: string, performedBy: string): Promise<{ message: string }> {
    await this.genreRepository.deactivateGenre(id, performedBy);
    return { message: "Genre deleted successfully" };
  }

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>> {
    return await this.genreRepository.searchGenres(searchTerm, pagination);
  }
}