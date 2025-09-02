import { Injectable, Inject } from '@nestjs/common';
import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { IBookAuthorAssignmentSearchService } from '../interfaces/book-author-assignment-search.service.interface';
import { IBookAuthorAssignmentSearchRepository } from '../interfaces/book-author-assignment-search.repository.interface';
import { IErrorHandlerService } from '../interfaces/error-handler.service.interface';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';
import { AssignmentFiltersDto } from '../dto/assignment-filters.dto';
import { AssignmentCsvExportFiltersDto } from '../dto/assignment-csv-export-filters.dto';
import { AssignmentExactSearchDto } from '../dto/assignment-exact-search.dto';
import { AssignmentSimpleFilterDto } from '../dto/assignment-simple-filter.dto';

@Injectable()
export class BookAuthorAssignmentSearchService implements IBookAuthorAssignmentSearchService {
  constructor(
    @Inject('IBookAuthorAssignmentSearchRepository')
    private searchRepository: IBookAuthorAssignmentSearchRepository,
    @Inject('IErrorHandlerService')
    private errorHandler: IErrorHandlerService,
  ) {}

  async exactSearch(
    searchDto: AssignmentExactSearchDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      return await this.searchRepository.exactSearchAssignments(searchDto);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL || 'Failed to search assignments',
      );
    }
  }

  async simpleFilter(
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      return await this.searchRepository.simpleFilterAssignments(term, pagination);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL || 'Failed to filter assignments',
      );
    }
  }

  async advancedFilter(
    filters: AssignmentFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      return await this.searchRepository.findWithFilters(filters, pagination);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL || 'Failed to filter assignments',
      );
    }
  }

  async exportToCsv(filters: AssignmentCsvExportFiltersDto): Promise<string> {
    try {
      return await this.searchRepository.exportToCsv(filters);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL ||
          'Failed to export assignments to CSV',
      );
    }
  }

  async findByBook(
    bookId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      return await this.searchRepository.getAssignmentsByBook(bookId, pagination);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL ||
          'Failed to retrieve assignments by book',
      );
    }
  }

  async findByAuthor(
    authorId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      return await this.searchRepository.getAssignmentsByAuthor(authorId, pagination);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL ||
          'Failed to retrieve assignments by author',
      );
    }
  }
}
