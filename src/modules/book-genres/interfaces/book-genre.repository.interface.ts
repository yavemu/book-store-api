import { BookGenre } from '../entities/book-genre.entity';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookGenreRepository {
  registerGenre(createBookGenreDto: CreateBookGenreDto): Promise<BookGenre>;
  getGenreProfile(genreId: string): Promise<BookGenre>;
  updateGenreProfile(genreId: string, updateBookGenreDto: UpdateBookGenreDto): Promise<BookGenre>;
  deactivateGenre(genreId: string): Promise<void>;
  searchGenres(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
  getAllGenres(pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
  checkGenreNameExists(genreName: string): Promise<boolean>;
}