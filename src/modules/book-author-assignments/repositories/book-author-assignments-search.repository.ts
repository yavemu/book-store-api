import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  ILike,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { BookAuthorAssignment } from '../entities/book-author-assignment.entity';
import { IBookAuthorAssignmentSearchRepository } from '../interfaces/book-author-assignment-search.repository.interface';
import { AssignmentFiltersDto } from '../dto/assignment-filters.dto';
import { AssignmentCsvExportFiltersDto } from '../dto/assignment-csv-export-filters.dto';
import { AssignmentExactSearchDto } from '../dto/assignment-exact-search.dto';
import { AssignmentSimpleFilterDto } from '../dto/assignment-simple-filter.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class BookAuthorAssignmentSearchRepository
  extends BaseRepository<BookAuthorAssignment>
  implements IBookAuthorAssignmentSearchRepository
{
  constructor(
    @InjectRepository(BookAuthorAssignment)
    private readonly assignmentRepository: Repository<BookAuthorAssignment>,
  ) {
    super(assignmentRepository);
    // El repositorio base ya tiene acceso a través del constructor
  }

  async exactSearchAssignments(
    searchDto: AssignmentExactSearchDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const whereCondition: any = {};
      whereCondition[searchDto.searchField] = searchDto.searchValue;

      const options: FindManyOptions<BookAuthorAssignment> = {
        where: whereCondition,
        order: { [searchDto.sortBy]: searchDto.sortOrder },
        skip: searchDto.offset,
        take: searchDto.limit,
        relations: ['book', 'author'],
      };

      return await this._findManyWithPagination(options, searchDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to search assignments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async simpleFilterAssignments(
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const maxLimit = Math.min(pagination.limit || 10, 50);
      
      // If no search term provided, return all assignments with pagination
      if (!term || term.trim().length === 0) {
        const options: FindManyOptions<BookAuthorAssignment> = {
          relations: ['book', 'author'],
          order: { [pagination.sortBy || 'createdAt']: pagination.sortOrder || 'DESC' },
          skip: pagination.offset,
          take: maxLimit,
        };
        return await this._findManyWithPagination(options, pagination);
      }

      // Validate minimum search term length
      const trimmedTerm = term.trim();
      if (trimmedTerm.length < 3) {
        throw new HttpException(
          'Search term must be at least 3 characters long',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Use TypeORM QueryBuilder for efficient LIKE queries across all fields
      const queryBuilder = this.repository
        .createQueryBuilder('assignment')
        .leftJoinAndSelect('assignment.book', 'book')
        .leftJoinAndSelect('assignment.author', 'author')
        .where('assignment.deletedAt IS NULL') // Soft delete filter
        .andWhere(
          '(LOWER(book.title) LIKE LOWER(:term) OR ' +
          'LOWER(book.isbnCode) LIKE LOWER(:term) OR ' +
          'LOWER(author.firstName) LIKE LOWER(:term) OR ' +
          'LOWER(author.lastName) LIKE LOWER(:term) OR ' +
          'LOWER(author.email) LIKE LOWER(:term))',
          { term: `%${trimmedTerm}%` }
        );

      // Get total count for pagination metadata
      const totalCount = await queryBuilder.getCount();

      // Apply sorting and pagination
      queryBuilder
        .orderBy(`assignment.${pagination.sortBy || 'createdAt'}`, pagination.sortOrder || 'DESC')
        .skip(pagination.offset)
        .take(maxLimit);

      const assignments = await queryBuilder.getMany();

      // Return using standard pagination format
      return {
        data: assignments,
        meta: {
          total: totalCount,
          page: pagination.page,
          limit: maxLimit,
          totalPages: Math.ceil(totalCount / maxLimit),
          hasNext: pagination.offset + maxLimit < totalCount,
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to perform simple filter', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findWithFilters(
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
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
        relations: ['book', 'author'],
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to filter assignments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAssignmentsByBook(
    bookId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthorAssignment>> {
    try {
      const options: FindManyOptions<BookAuthorAssignment> = {
        where: { bookId },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
        relations: ['book', 'author'],
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
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
        relations: ['book', 'author'],
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException(
        'Failed to get assignments by author',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async exportToCsv(filters: AssignmentCsvExportFiltersDto): Promise<string> {
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
        order: { createdAt: 'DESC' },
        relations: ['book', 'author'],
      });

      const csvHeaders = 'ID,Book Title,Author Name,Created At,Updated At\n';
      const csvRows = assignments
        .map((assignment) => {
          const bookTitle = assignment.book ? assignment.book.title : 'N/A';
          const authorName = assignment.author
            ? `${assignment.author.firstName} ${assignment.author.lastName}`
            : 'N/A';
          const createdAt = assignment.createdAt
            ? this.formatDateTimeForCsv(assignment.createdAt)
            : 'N/A';
          const updatedAt = assignment.updatedAt
            ? this.formatDateTimeForCsv(assignment.updatedAt)
            : 'N/A';

          return `"${assignment.id}","${bookTitle}","${authorName}","${createdAt}","${updatedAt}"`;
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
