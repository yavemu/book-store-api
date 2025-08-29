import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export interface IBookAuthorAssignmentSearchRepository {
  getAssignmentsByBook(bookId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  getAssignmentsByAuthor(authorId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  checkAssignmentExists(bookId: string, authorId: string): Promise<boolean>;
  searchAssignments(term: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
}