import { BookGenre } from '../entities/book-genre.entity';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

export interface IBookGenreRepository {
  registerGenre(
    createBookGenreDto: CreateBookGenreDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<BookGenre>>;
  getGenreProfile(genreId: string): Promise<SuccessResponseDto<BookGenre>>;
  updateGenreProfile(
    genreId: string,
    updateBookGenreDto: UpdateBookGenreDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<BookGenre>>;
  deactivateGenre(
    genreId: string,
    performedBy?: string,
  ): Promise<SuccessResponseDto<{ id: string }>>;
  searchGenres(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookGenre>>>;
  getAllGenres(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookGenre>>>;
  checknameExists(name: string): Promise<boolean>;
}