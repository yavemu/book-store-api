import { BookGenre } from '../entities/book-genre.entity';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';

export interface IBookGenreService {
  create(
    createBookGenreDto: CreateBookGenreDto,
    performedBy: string,
  ): Promise<PaginatedResult<BookGenre>>;
  findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PaginatedResult<BookGenre>>>;
  findById(id: string): Promise<PaginatedResult<BookGenre>>;
  update(
    id: string,
    updateBookGenreDto: UpdateBookGenreDto,
    performedBy: string,
  ): Promise<PaginatedResult<BookGenre>>;
  softDelete(
    id: string,
    performedBy: string,
  ): Promise<PaginatedResult<{ id: string }>>;
  search(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PaginatedResult<BookGenre>>>;
}