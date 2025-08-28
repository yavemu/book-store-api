import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

export interface IBookAuthorAssignmentRepository {
  createAssignment(
    createBookAuthorAssignmentDto: CreateBookAuthorAssignmentDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<BookAuthorAssignment>>;
  getAssignmentProfile(
    assignmentId: string,
  ): Promise<SuccessResponseDto<BookAuthorAssignment>>;
  updateAssignment(
    assignmentId: string,
    updateBookAuthorAssignmentDto: UpdateBookAuthorAssignmentDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<BookAuthorAssignment>>;
  deactivateAssignment(
    assignmentId: string,
    performedBy?: string,
  ): Promise<SuccessResponseDto<{ id: string }>>;
  getAllAssignments(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookAuthorAssignment>>>;
  getAssignmentsByBook(
    bookId: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookAuthorAssignment>>>;
  getAssignmentsByAuthor(
    authorId: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookAuthorAssignment>>>;
  checkAssignmentExists(bookId: string, authorId: string): Promise<boolean>;
}