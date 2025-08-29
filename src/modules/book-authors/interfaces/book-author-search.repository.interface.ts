import { BookAuthor } from '../entities/book-author.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookAuthorSearchRepository {
  searchByTerm(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  findByNationality(nationality: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>>;
  findByFullName(firstName: string, lastName: string): Promise<BookAuthor | null>;
}