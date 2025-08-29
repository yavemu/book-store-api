import { BookGenre } from '../entities/book-genre.entity';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookGenreCrudRepository {
  registerGenre(createBookGenreDto: CreateBookGenreDto, performedBy: string): Promise<BookGenre>;
  getAllGenres(pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
  getGenreProfile(genreId: string): Promise<BookGenre>;
  updateGenreProfile(genreId: string, updateBookGenreDto: UpdateBookGenreDto, performedBy: string): Promise<BookGenre>;
  deactivateGenre(genreId: string, performedBy: string): Promise<{ id: string }>;
}
