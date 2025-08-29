import { BookGenre } from '../entities/book-genre.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookGenreSearchRepository {
  searchGenres(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
  checkNameExists(name: string): Promise<boolean>;
}
