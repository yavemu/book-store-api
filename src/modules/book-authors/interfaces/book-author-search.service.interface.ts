import { BookAuthor } from '../entities/book-author.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookAuthorSearchService {
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  findByFullName(firstName: string, lastName: string): Promise<BookAuthor>;
}