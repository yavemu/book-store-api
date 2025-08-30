import { BookGenre } from '../entities/book-genre.entity';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookGenreCrudService {
  create(createBookGenreDto: CreateBookGenreDto, performedBy: string): Promise<BookGenre>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
  findById(id: string): Promise<BookGenre>;
  update(
    id: string,
    updateBookGenreDto: UpdateBookGenreDto,
    performedBy: string,
  ): Promise<BookGenre>;
  softDelete(id: string, performedBy: string): Promise<{ id: string }>;
}
