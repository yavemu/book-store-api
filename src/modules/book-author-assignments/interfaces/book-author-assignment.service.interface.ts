import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookAuthorAssignmentService {
  create(
    createBookAuthorAssignmentDto: CreateBookAuthorAssignmentDto,
    performedBy: string,
  ): Promise<BookAuthorAssignment>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  findById(id: string): Promise<BookAuthorAssignment>;
  update(
    id: string,
    updateBookAuthorAssignmentDto: UpdateBookAuthorAssignmentDto,
    performedBy: string,
  ): Promise<BookAuthorAssignment>;
  softDelete(id: string, performedBy: string): Promise<void>;
  findByBook(
    bookId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>>;
  findByAuthor(
    authorId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>>;
  checkAssignmentExists(bookId: string, authorId: string): Promise<{ exists: boolean }>;
}
