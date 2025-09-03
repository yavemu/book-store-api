import { Injectable, Inject } from '@nestjs/common';
import { IBookAuthorCrudRepository } from '../interfaces';
import { IBookAuthorSearchRepository } from '../interfaces';
import { IBookAuthorValidationRepository } from '../interfaces';
import { IBookAuthorCrudService } from '../interfaces';
import { IBookAuthorSearchService } from '../interfaces';
import { IValidationService } from '../interfaces';
import { IErrorHandlerService } from '../interfaces';
import { BookAuthor } from '../entities/book-author.entity';
import { CreateBookAuthorDto } from '../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../dto/update-book-author.dto';
import { BookAuthorFiltersDto } from '../dto/book-author-filters.dto';
import { BookAuthorCsvExportFiltersDto } from '../dto/book-author-csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class BookAuthorService implements IBookAuthorCrudService, IBookAuthorSearchService {
  constructor(
    @Inject('IBookAuthorCrudRepository')
    private readonly crudRepository: IBookAuthorCrudRepository,
    @Inject('IBookAuthorSearchRepository')
    private readonly searchRepository: IBookAuthorSearchRepository,
    @Inject('IBookAuthorValidationRepository')
    private readonly validationRepository: IBookAuthorValidationRepository,
    @Inject('IValidationService')
    private readonly validationService: IValidationService,
    @Inject('IErrorHandlerService')
    private readonly errorHandler: IErrorHandlerService,
  ) {}

  async create(createBookAuthorDto: CreateBookAuthorDto, performedBy: string): Promise<BookAuthor> {
    try {
      const uniqueConstraints = [
        {
          field: ['firstName', 'lastName'] as string[],
          message: ERROR_MESSAGES.BOOK_AUTHORS.ALREADY_EXISTS,
          transform: (value: string) => value.trim(),
        },
      ];

      await this.validationService.validateUniqueConstraints(
        createBookAuthorDto,
        undefined,
        uniqueConstraints,
        this.validationRepository,
      );

      return await this.crudRepository.createAuthor({ createBookAuthorDto, performedBy });
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_CREATE);
    }
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.crudRepository.getAllAuthors({ pagination });
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_GET_ALL);
    }
  }

  async findById(id: string): Promise<BookAuthor> {
    try {
      const author = await this.crudRepository.getAuthorById({ authorId: id });
      if (!author) {
        this.errorHandler.createNotFoundException(ERROR_MESSAGES.BOOK_AUTHORS.NOT_FOUND);
      }
      return author;
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.NOT_FOUND);
    }
  }

  async update(
    id: string,
    updateBookAuthorDto: UpdateBookAuthorDto,
    performedBy: string,
  ): Promise<BookAuthor> {
    try {
      const existingAuthor = await this.crudRepository.getAuthorById({ authorId: id });
      if (!existingAuthor) {
        this.errorHandler.createNotFoundException(ERROR_MESSAGES.BOOK_AUTHORS.NOT_FOUND);
      }

      const validationDto = {
        firstName: updateBookAuthorDto.firstName || existingAuthor.firstName,
        lastName: updateBookAuthorDto.lastName || existingAuthor.lastName,
      };

      const uniqueConstraints = [
        {
          field: ['firstName', 'lastName'] as string[],
          message: ERROR_MESSAGES.BOOK_AUTHORS.ALREADY_EXISTS,
          transform: (value: string) => value.trim(),
        },
      ];

      await this.validationService.validateUniqueConstraints(
        validationDto,
        id,
        uniqueConstraints,
        this.validationRepository,
      );

      return await this.crudRepository.updateAuthor({ authorId: id, updateBookAuthorDto, performedBy });
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_UPDATE);
    }
  }

  async softDelete(id: string, performedBy: string): Promise<{ id: string }> {
    try {
      return await this.crudRepository.deleteAuthor({ authorId: id, performedBy });
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_DELETE);
    }
  }

  async search(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.searchRepository.searchByTerm(searchTerm, pagination);
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
      return await this.searchRepository.findByFullName(firstName, lastName, pagination);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.NOT_FOUND);
    }
  }

  async findWithFilters(
    filters: BookAuthorFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      return await this.searchRepository.findWithFilters(filters, pagination);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_GET_ALL);
    }
  }

  async exportToCsv(filters: BookAuthorCsvExportFiltersDto): Promise<string> {
    try {
      return await this.searchRepository.exportToCsv(filters);
    } catch (error) {
      this.errorHandler.handleError(error, ERROR_MESSAGES.BOOK_AUTHORS.FAILED_TO_GET_ALL);
    }
  }

  // Methods required by IBookAuthorSearchService interface
  async exactSearch(searchDto: any): Promise<PaginatedResult<BookAuthor>> {
    return this.search(searchDto.searchTerm || '', searchDto);
  }

  async simpleFilter(filterDto: any): Promise<PaginatedResult<BookAuthor>> {
    return this.search(filterDto.term || '', filterDto);
  }

  async advancedFilter(
    filters: BookAuthorFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    return this.findWithFilters(filters, pagination);
  }
}
