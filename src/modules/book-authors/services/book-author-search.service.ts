import { Injectable, Inject } from '@nestjs/common';
import { IBookAuthorSearchRepository } from '../interfaces';
import { IBookAuthorSearchService } from '../interfaces';
import { IErrorHandlerService } from '../interfaces';
import { BookAuthor } from '../entities/book-author.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import {
  BookAuthorFiltersDto,
  BookAuthorExactSearchDto,
  BookAuthorSimpleFilterDto,
  BookAuthorCsvExportFiltersDto,
} from '../dto';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class BookAuthorSearchService implements IBookAuthorSearchService {
  constructor(
    @Inject('IBookAuthorSearchRepository')
    private readonly searchRepository: IBookAuthorSearchRepository,
    @Inject('IErrorHandlerService')
    private readonly errorHandler: IErrorHandlerService,
  ) {}

  async search(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.searchRepository.searchAuthorsByTerm(searchTerm, pagination);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_GET_ALL);
    }
  }

  async findByFullName(
    firstName: string,
    lastName: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.searchRepository.findAuthorsByFullName(firstName, lastName, pagination);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.NOT_FOUND);
    }
  }

  async findWithFilters(
    filters: BookAuthorFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.searchRepository.findAuthorsWithFilters(filters, pagination);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_GET_ALL);
    }
  }

  async exportToCsv(filters?: BookAuthorCsvExportFiltersDto, res?: any, userId?: string): Promise<string> {
    try {
      return await this.searchRepository.exportAuthorsToCsv(filters);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_GET_ALL);
    }
  }

  // Standardized search methods (following book-catalog pattern)
  async exactSearch(
    searchDto: BookAuthorExactSearchDto,
    pagination: PaginationDto,
    userId?: string,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.searchRepository.searchAuthorsExact(searchDto, pagination);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_GET_ALL);
    }
  }

  async simpleFilter(
    term: string,
    pagination: PaginationDto,
    userId?: string,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.searchRepository.filterAuthorsSimple(term, pagination);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_GET_ALL);
    }
  }

  async advancedFilter(
    filters: BookAuthorFiltersDto,
    pagination: PaginationDto,
    userId?: string,
  ): Promise<PaginatedResult<BookAuthor>> {
    // Delegate to existing method
    return await this.findWithFilters(filters, pagination);
  }
}
