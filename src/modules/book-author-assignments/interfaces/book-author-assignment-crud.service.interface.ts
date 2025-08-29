import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export interface IBookAuthorAssignmentCrudService {
  create(createDto: CreateBookAuthorAssignmentDto, performedBy?: string): Promise<BookAuthorAssignment>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  findById(id: string): Promise<BookAuthorAssignment>;
  update(id: string, updateDto: UpdateBookAuthorAssignmentDto, performedBy?: string): Promise<BookAuthorAssignment>;
  remove(id: string, performedBy?: string): Promise<void>;
}