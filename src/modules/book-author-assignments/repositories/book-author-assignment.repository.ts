import { Injectable, NotFoundException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  ILike,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from 'typeorm';
import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { IBookAuthorAssignmentRepository } from '../interfaces/book-author-assignment.repository.interface';
import { IBookAuthorAssignmentCrudRepository } from '../interfaces/book-author-assignment-crud.repository.interface';
import { IBookAuthorAssignmentSearchRepository } from '../interfaces/book-author-assignment-search.repository.interface';
import { IBookAuthorAssignmentValidationRepository } from '../interfaces/book-author-assignment-validation.repository.interface';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { AssignmentFiltersDto } from '../dto/assignment-filters.dto';
import { AssignmentCsvExportFiltersDto } from '../dto/assignment-csv-export-filters.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import { ListSelectDto } from '../../../common/dto/list-select.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { IAuditLoggerService } from '../../../modules/audit/interfaces/audit-logger.service.interface';

@Injectable()
export class BookAuthorAssignmentRepository
  extends BaseRepository<BookAuthorAssignment>
  implements
    IBookAuthorAssignmentRepository,
    IBookAuthorAssignmentCrudRepository,
    IBookAuthorAssignmentSearchRepository,
    IBookAuthorAssignmentValidationRepository
{
  private readonly entityName: string = 'BookAuthorAssignment';

  constructor(
    @InjectRepository(BookAuthorAssignment)
    private readonly assignmentRepository: Repository<BookAuthorAssignment>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService: IAuditLoggerService,
  ) {
    super(assignmentRepository, auditLogService);
  }

  // Public business logic methods

  async createAssignment(
    createBookAuthorAssignmentDto: CreateBookAuthorAssignmentDto,
    performedBy: string,
  ): Promise<BookAuthorAssignment> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createBookAuthorAssignmentDto, undefined, [
        {
          field: ['bookId', 'authorId'],
          message: 'Book-author assignment already exists',
        },
      ]);

      // Use inherited method from BaseRepository
      return await this._create(
        createBookAuthorAssignmentDto,
        performedBy,
        this.entityName,
        (assignment) =>
          `Assignment created for book ${assignment.bookId} and author ${assignment.authorId}`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to create assignment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAssignmentProfile(assignmentId: string): Promise<BookAuthorAssignment> {
    try {
      const assignment = await this._findOne({
        where: { id: assignmentId },
        relations: ['book', 'author'],
      });
      if (!assignment) {
        throw new NotFoundException('Assignment not found');
      }
      return assignment;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get assignment profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAssignment(
    assignmentId: string,
    updateBookAuthorAssignmentDto: UpdateBookAuthorAssignmentDto,
    performedBy: string,
  ): Promise<BookAuthorAssignment> {
    try {
      const assignment = await this.getAssignmentProfile(assignmentId);

      // Create combined DTO with existing values for validation
      const validationDto = {
        bookId: updateBookAuthorAssignmentDto.bookId || assignment.bookId,
        authorId: updateBookAuthorAssignmentDto.authorId || assignment.authorId,
      };

      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(validationDto, assignmentId, [
        {
          field: ['bookId', 'authorId'],
          message: 'Book-author assignment already exists',
        },
      ]);

      // Use inherited method from BaseRepository
      return await this._update(
        assignmentId,
        updateBookAuthorAssignmentDto,
        performedBy,
        this.entityName,
        (assignment) => `Assignment ${assignment.id} updated.`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update assignment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateAssignment(assignmentId: string, performedBy: string): Promise<{ id: string }> {
    try {
      const book = await this.getAssignmentProfile(assignmentId);
      return await this._softDelete(
        assignmentId,
        performedBy,
        this.entityName,
        (assignment) => `Assignment ${assignment.id} deactivated.`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to deactivate assignment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllAssignments(
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const options: FindManyOptions<BookAuthorAssignment> = {
        relations: ['book', 'author'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get all assignments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAssignmentsByBook(
    bookId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const options: FindManyOptions<BookAuthorAssignment> = {
        where: { bookId },
        relations: ['book', 'author'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException(
        'Failed to get assignments by book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAssignmentsByAuthor(
    authorId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const options: FindManyOptions<BookAuthorAssignment> = {
        where: { authorId },
        relations: ['book', 'author'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException(
        'Failed to get assignments by author',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkAssignmentExists(bookId: string, authorId: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { bookId, authorId },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to check assignment existence',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findForSelect(): Promise<BookAuthorAssignment[]> {
    return await this._findMany({
      select: ['id', 'bookId', 'authorId'],
      relations: ['book', 'author'],
      order: { createdAt: 'ASC' },
    });
  }

  async findByBookAndAuthor(bookId: string, authorId: string): Promise<BookAuthorAssignment> {
    return await this._findOne({
      where: { bookId, authorId },
      relations: ['book', 'author'],
    });
  }

  async searchAssignments(
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const options: FindManyOptions<BookAuthorAssignment> = {
        where: [
          { book: { title: ILike(`%${term}%`) } },
          { author: { firstName: ILike(`%${term}%`) } },
          { author: { lastName: ILike(`%${term}%`) } },
        ],
        relations: ['book', 'author'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to search assignments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async _validateUniqueConstraints(
    dto: Partial<BookAuthorAssignment>,
    entityId?: string,
    constraints?: any[],
  ): Promise<void> {
    if (!constraints) return;

    for (const constraint of constraints) {
      if (constraint.field.includes('bookId') && constraint.field.includes('authorId')) {
        const bookId = dto.bookId;
        const authorId = dto.authorId;

        if (!bookId || !authorId) continue;

        let existingEntity: BookAuthorAssignment;
        if (entityId) {
          existingEntity = await this._findOne({
            where: {
              bookId,
              authorId,
              id: { not: entityId } as any,
            },
          });
        } else {
          existingEntity = await this.findByBookAndAuthor(bookId, authorId);
        }

        if (existingEntity) {
          throw new Error(constraint.message);
        }
      }
    }
  }

  async findAssignmentsWithFilters(
    filters: AssignmentFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const whereConditions: any = {};

      if (filters.bookId) {
        whereConditions.bookId = filters.bookId;
      }

      if (filters.authorId) {
        whereConditions.authorId = filters.authorId;
      }

      if (filters.createdAfter && filters.createdBefore) {
        whereConditions.createdAt = Between(
          new Date(filters.createdAfter),
          new Date(filters.createdBefore),
        );
      } else if (filters.createdAfter) {
        whereConditions.createdAt = MoreThanOrEqual(new Date(filters.createdAfter));
      } else if (filters.createdBefore) {
        whereConditions.createdAt = LessThanOrEqual(new Date(filters.createdBefore));
      }

      const options: FindManyOptions<BookAuthorAssignment> = {
        where: whereConditions,
        relations: ['book', 'author'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to filter assignments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async exportAssignmentsToCsv(filters: AssignmentCsvExportFiltersDto): Promise<string> {
    try {
      const whereConditions: any = {};

      if (filters.bookId) {
        whereConditions.bookId = filters.bookId;
      }

      if (filters.authorId) {
        whereConditions.authorId = filters.authorId;
      }

      if (filters.startDate && filters.endDate) {
        whereConditions.createdAt = Between(new Date(filters.startDate), new Date(filters.endDate));
      } else if (filters.startDate) {
        whereConditions.createdAt = MoreThanOrEqual(new Date(filters.startDate));
      } else if (filters.endDate) {
        whereConditions.createdAt = LessThanOrEqual(new Date(filters.endDate));
      }

      const assignments = await this._findMany({
        where: whereConditions,
        relations: ['book', 'author'],
        order: { createdAt: 'DESC' },
      });

      const csvHeaders = 'ID,Book ID,Book Title,Author ID,Author Name,Created At\n';
      const csvRows = assignments
        .map((assignment) => {
          const bookTitle = assignment.book?.title || 'N/A';
          const authorName = assignment.author
            ? `${assignment.author.firstName} ${assignment.author.lastName}`.trim()
            : 'N/A';
          const createdAt = assignment.createdAt
            ? this.formatDateTimeForCsv(assignment.createdAt)
            : 'N/A';

          return `"${assignment.id}","${assignment.bookId}","${bookTitle}","${assignment.authorId}","${authorName}","${createdAt}"`;
        })
        .join('\n');

      return csvHeaders + csvRows;
    } catch (error) {
      throw new HttpException(
        'Failed to export assignments to CSV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Methods required by IBookAuthorAssignmentSearchRepository interface
  async exactSearchAssignments(searchDto: any): Promise<PaginatedResult<BookAuthorAssignment>> {
    return this.searchAssignments(searchDto.searchTerm || '', searchDto);
  }

  async simpleFilterAssignments(filterDto: any): Promise<PaginatedResult<BookAuthorAssignment>> {
    return this.findAssignmentsWithFilters(filterDto, filterDto);
  }

  async findWithFilters(
    filters: AssignmentFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    return this.findAssignmentsWithFilters(filters, pagination);
  }

  async exportToCsv(filters: AssignmentCsvExportFiltersDto): Promise<string> {
    return this.exportAssignmentsToCsv(filters);
  }

  /**
   * Helper method to format datetime safely for CSV export
   * @private
   */
  private formatDateTimeForCsv(date: Date | string): string {
    try {
      if (!date) return '';

      // If it's a string, try to parse it as a Date
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString();
        }
        return '';
      }

      // If it's a Date object, format it
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toISOString();
      }

      return '';
    } catch (error) {
      return '';
    }
  }
}
