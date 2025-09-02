import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { AssignmentFiltersDto } from '../dto/assignment-filters.dto';
import { AssignmentCsvExportFiltersDto } from '../dto/assignment-csv-export-filters.dto';
import { AssignmentExactSearchDto } from '../dto/assignment-exact-search.dto';
import { AssignmentSimpleFilterDto } from '../dto/assignment-simple-filter.dto';

export interface IBookAuthorAssignmentSearchService {
  exactSearch(searchDto: AssignmentExactSearchDto): Promise<PaginatedResult<BookAuthorAssignment>>;
  simpleFilter(
    filterDto: AssignmentSimpleFilterDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>>;
  advancedFilter(
    filters: AssignmentFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>>;
  exportToCsv(filters: AssignmentCsvExportFiltersDto): Promise<string>;
  findByBook(
    bookId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>>;
  findByAuthor(
    authorId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>>;
}
