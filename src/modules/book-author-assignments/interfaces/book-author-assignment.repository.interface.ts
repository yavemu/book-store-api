import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IBookAuthorAssignmentRepository {
  createAssignment(createBookAuthorAssignmentDto: CreateBookAuthorAssignmentDto): Promise<BookAuthorAssignment>;
  getAssignmentProfile(assignmentId: string): Promise<BookAuthorAssignment>;
  updateAssignment(assignmentId: string, updateBookAuthorAssignmentDto: UpdateBookAuthorAssignmentDto): Promise<BookAuthorAssignment>;
  deactivateAssignment(assignmentId: string): Promise<void>;
  getAllAssignments(pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  getAssignmentsByBook(bookId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  getAssignmentsByAuthor(authorId: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  checkAssignmentExists(bookId: string, authorId: string): Promise<boolean>;
}