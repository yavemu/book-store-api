import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import { AssignmentFiltersDto } from '../dto/assignment-filters.dto';
import { AssignmentCsvExportFiltersDto } from '../dto/assignment-csv-export-filters.dto';

export interface IBookAuthorAssignmentSearchRepository {
  getAssignmentsByBook(
    bookId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>>;
  getAssignmentsByAuthor(
    authorId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>>;
  checkAssignmentExists(bookId: string, authorId: string): Promise<boolean>;
  searchAssignments(
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>>;
  findAssignmentsWithFilters(
    filters: AssignmentFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>>;
  exportAssignmentsToCsv(filters: AssignmentCsvExportFiltersDto): Promise<string>;
}
