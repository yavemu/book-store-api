import { Injectable, Inject } from '@nestjs/common';
import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import { IBookAuthorAssignmentSearchService } from '../interfaces/book-author-assignment-search.service.interface';
import { IBookAuthorAssignmentSearchRepository } from '../interfaces/book-author-assignment-search.repository.interface';
import { IErrorHandlerService } from '../interfaces/error-handler.service.interface';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';
import { AssignmentFiltersDto } from '../dto/assignment-filters.dto';
import { AssignmentCsvExportFiltersDto } from '../dto/assignment-csv-export-filters.dto';

@Injectable()
export class BookAuthorAssignmentSearchService implements IBookAuthorAssignmentSearchService {
  constructor(
    @Inject('IBookAuthorAssignmentSearchRepository')
    private searchRepository: IBookAuthorAssignmentSearchRepository,
    @Inject('IErrorHandlerService')
    private errorHandler: IErrorHandlerService,
  ) {}

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

  async checkAssignmentExists(bookId: string, authorId: string): Promise<{ exists: boolean }> {
    try {
      const exists = await this.searchRepository.checkAssignmentExists(bookId, authorId);
      return { exists };
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL ||
          'Failed to check assignment existence',
      );
    }
  }

  async searchAssignments(
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      return await this.searchRepository.searchAssignments(term, pagination);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL || 'Failed to search assignments',
      );
    }
  }

  async findAssignmentsWithFilters(
    filters: AssignmentFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      return await this.searchRepository.findAssignmentsWithFilters(filters, pagination);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL || 'Failed to filter assignments',
      );
    }
  }

  async exportAssignmentsToCsv(filters: AssignmentCsvExportFiltersDto): Promise<string> {
    try {
      return await this.searchRepository.exportAssignmentsToCsv(filters);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL ||
          'Failed to export assignments to CSV',
      );
    }
  }
}
