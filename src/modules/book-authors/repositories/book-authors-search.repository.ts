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
import { BookAuthor } from '../entities/book-author.entity';
import { IBookAuthorSearchRepository } from '../interfaces/book-author-search.repository.interface';
import { BookAuthorFiltersDto } from '../dto/book-author-filters.dto';
import { BookAuthorCsvExportFiltersDto } from '../dto/book-author-csv-export-filters.dto';
import { BookAuthorExactSearchDto } from '../dto/book-author-exact-search.dto';
import { BookAuthorSimpleFilterDto } from '../dto/book-author-simple-filter.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class BookAuthorSearchRepository
  extends BaseRepository<BookAuthor>
  implements IBookAuthorSearchRepository
{
  constructor(
    @InjectRepository(BookAuthor)
    private readonly authorRepository: Repository<BookAuthor>,
  ) {
    super(authorRepository);
  }

  async exactSearchAuthors(
    searchDto: BookAuthorExactSearchDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      const whereCondition: any = {};
      whereCondition[searchDto.searchField] = searchDto.searchValue;

      const options: FindManyOptions<BookAuthor> = {
        where: whereCondition,
        order: { [searchDto.sortBy]: searchDto.sortOrder },
        skip: searchDto.offset,
        take: searchDto.limit,
      };

      return await this._findManyWithPagination(options, searchDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to search authors', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async simpleFilterAuthors(
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      const maxLimit = Math.min(pagination.limit || 10, 50);
      
      // If no search term provided, return all authors with pagination
      if (!term || term.trim().length === 0) {
        const options: FindManyOptions<BookAuthor> = {
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
        .createQueryBuilder('author')
        .where('author.deletedAt IS NULL') // Soft delete filter
        .andWhere(
          '(LOWER(author.firstName) LIKE LOWER(:term) OR ' +
          'LOWER(author.lastName) LIKE LOWER(:term) OR ' +
          'LOWER(author.email) LIKE LOWER(:term) OR ' +
          'LOWER(author.biography) LIKE LOWER(:term) OR ' +
          'LOWER(author.nationality) LIKE LOWER(:term))',
          { term: `%${trimmedTerm}%` }
        );

      // Get total count for pagination metadata
      const totalCount = await queryBuilder.getCount();

      // Apply sorting and pagination
      queryBuilder
        .orderBy(`author.${pagination.sortBy || 'createdAt'}`, pagination.sortOrder || 'DESC')
        .skip(pagination.offset)
        .take(maxLimit);

      const authors = await queryBuilder.getMany();

      // Return using standard pagination format
      return {
        data: authors,
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

  async findByName(name: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    try {
      const trimmedName = name.trim().toLowerCase();
      const allAuthorsOptions: FindManyOptions<BookAuthor> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
      };

      const allAuthors = await this._findMany(allAuthorsOptions);

      const filteredAuthors = allAuthors.filter((author) => {
        const fullName = `${author.firstName} ${author.lastName}`.toLowerCase();
        return (
          fullName.includes(trimmedName) ||
          author.firstName.toLowerCase().includes(trimmedName) ||
          author.lastName.toLowerCase().includes(trimmedName)
        );
      });

      const total = filteredAuthors.length;
      const startIndex = pagination.offset || 0;
      const endIndex = startIndex + (pagination.limit || 10);
      const paginatedData = filteredAuthors.slice(startIndex, endIndex);

      return this._buildPaginatedResult(paginatedData, total, pagination);
    } catch (error) {
      throw new HttpException('Failed to search authors by name', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findWithFilters(
    filters: BookAuthorFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    try {
      const whereConditions: any = {};

      if (filters.firstName) {
        whereConditions.firstName = ILike(`%${filters.firstName}%`);
      }

      if (filters.lastName) {
        whereConditions.lastName = ILike(`%${filters.lastName}%`);
      }

      if (filters.email) {
        whereConditions.email = ILike(`%${filters.email}%`);
      }

      if (filters.biography) {
        whereConditions.biography = ILike(`%${filters.biography}%`);
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

      const options: FindManyOptions<BookAuthor> = {
        where: whereConditions,
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to filter authors', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async exportToCsv(filters: BookAuthorCsvExportFiltersDto): Promise<string> {
    try {
      const whereConditions: any = {};

      if (filters.firstName) {
        whereConditions.firstName = ILike(`%${filters.firstName}%`);
      }

      if (filters.lastName) {
        whereConditions.lastName = ILike(`%${filters.lastName}%`);
      }

      if (filters.email) {
        whereConditions.email = ILike(`%${filters.email}%`);
      }

      if (filters.startDate && filters.endDate) {
        whereConditions.createdAt = Between(new Date(filters.startDate), new Date(filters.endDate));
      } else if (filters.startDate) {
        whereConditions.createdAt = MoreThanOrEqual(new Date(filters.startDate));
      } else if (filters.endDate) {
        whereConditions.createdAt = LessThanOrEqual(new Date(filters.endDate));
      }

      const authors = await this._findMany({
        where: whereConditions,
        order: { createdAt: 'DESC' },
      });

      const csvHeaders = 'ID,First Name,Last Name,Email,Biography,Created At,Updated At\n';
      const csvRows = authors
        .map((author) => {
          const firstName = author.firstName || 'N/A';
          const lastName = author.lastName || 'N/A';
          const email = author.email || 'N/A';
          const biography = author.biography ? author.biography.replace(/"/g, '""') : 'N/A';
          const createdAt = author.createdAt ? author.createdAt.toISOString() : 'N/A';
          const updatedAt = author.updatedAt ? author.updatedAt.toISOString() : 'N/A';

          return `"${author.id}","${firstName}","${lastName}","${email}","${biography}","${createdAt}","${updatedAt}"`;
        })
        .join('\n');

      return csvHeaders + csvRows;
    } catch (error) {
      throw new HttpException('Failed to export authors to CSV', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Methods required by IBookAuthorSearchRepository interface
  async searchByTerm(
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    return this.simpleFilterAuthors(term, pagination);
  }

  async findByNationality(
    nationality: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    return this.findWithFilters({ nationality }, pagination);
  }

  async findByFullName(
    firstName: string,
    lastName: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    return this.findWithFilters({ firstName, lastName }, pagination);
  }

  // Removed duplicate methods - using existing ones from earlier in file
}
