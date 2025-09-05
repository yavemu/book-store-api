import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export interface IBookAuthorAssignmentCrudRepository {
  createAssignment(
    createDto: CreateBookAuthorAssignmentDto,
    performedBy?: string,
  ): Promise<BookAuthorAssignment>;
  getAllAssignments(pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  getAssignmentProfile(id: string): Promise<BookAuthorAssignment>;
  updateAssignment(
    id: string,
    updateDto: UpdateBookAuthorAssignmentDto,
    performedBy?: string,
  ): Promise<BookAuthorAssignment>;
  deactivateAssignment(id: string, performedBy?: string): Promise<{ id: string }>;
  findForSelect(): Promise<BookAuthorAssignment[]>;
}
