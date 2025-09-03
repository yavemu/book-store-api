import { Injectable, Inject } from '@nestjs/common';
import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../interfaces';
import { IBookAuthorAssignmentCrudService } from '../interfaces';
import { IBookAuthorAssignmentCrudRepository } from '../interfaces';
import { IValidationService } from '../interfaces';
import { IErrorHandlerService } from '../interfaces';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

const UNIQUE_CONSTRAINTS = [
  {
    field: ['bookId', 'authorId'],
    message: ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.ALREADY_EXISTS || 'Assignment already exists',
  },
];

@Injectable()
export class BookAuthorAssignmentCrudService implements IBookAuthorAssignmentCrudService {
  constructor(
    @Inject('IBookAuthorAssignmentCrudRepository')
    private crudRepository: IBookAuthorAssignmentCrudRepository,
    @Inject('IValidationService')
    private validationService: IValidationService,
    @Inject('IErrorHandlerService')
    private errorHandler: IErrorHandlerService,
  ) {}

  async create(
    createDto: CreateBookAuthorAssignmentDto,
    performedBy?: string,
  ): Promise<BookAuthorAssignment> {
    try {
      await this.validationService.validateUniqueConstraints(
        createDto,
        undefined,
        UNIQUE_CONSTRAINTS,
        this.crudRepository,
      );

      return await this.crudRepository.createAssignment(createDto, performedBy);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_CREATE || 'Failed to create assignment',
      );
    }
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      return await this.crudRepository.getAllAssignments(pagination);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL ||
          'Failed to retrieve assignments',
      );
    }
  }

  async findById(id: string): Promise<BookAuthorAssignment> {
    try {
      const assignment = await this.crudRepository.getAssignmentProfile(id);
      if (!assignment) {
        this.errorHandler.createNotFoundException(
          ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.NOT_FOUND || 'Assignment not found',
        );
      }
      return assignment;
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_GET_ALL ||
          'Failed to retrieve assignment',
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateBookAuthorAssignmentDto,
    performedBy?: string,
  ): Promise<BookAuthorAssignment> {
    try {
      await this.findById(id);
      await this.validationService.validateUniqueConstraints(
        updateDto,
        id,
        UNIQUE_CONSTRAINTS,
        this.crudRepository,
      );

      return await this.crudRepository.updateAssignment(id, updateDto, performedBy);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_UPDATE || 'Failed to update assignment',
      );
    }
  }

  async remove(id: string, performedBy?: string): Promise<void> {
    try {
      await this.findById(id);
      await this.crudRepository.deactivateAssignment(id, performedBy);
    } catch (error) {
      this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.BOOK_AUTHOR_ASSIGNMENTS?.FAILED_TO_DELETE || 'Failed to delete assignment',
      );
    }
  }
}
