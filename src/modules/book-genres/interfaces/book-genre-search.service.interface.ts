import { BookGenre } from '../entities/book-genre.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookGenreSearchService {
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>>;
}
