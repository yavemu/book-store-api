import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  ILike,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from 'typeorm';
import { BookGenre } from '../entities/book-genre.entity';
import { IBookGenreSearchRepository } from '../interfaces/book-genre-search.repository.interface';
import { BookGenreFiltersDto } from '../dto/book-genre-filters.dto';
import { BookGenreCsvExportFiltersDto } from '../dto/book-genre-csv-export-filters.dto';
import { BookGenreExactSearchDto } from '../dto/book-genre-exact-search.dto';
import { BookGenreSimpleFilterDto } from '../dto/book-genre-simple-filter.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class BookGenreSearchRepository
  extends BaseRepository<BookGenre>
  implements IBookGenreSearchRepository
{
  constructor(
    @InjectRepository(BookGenre)
    private readonly genreRepository: Repository<BookGenre>,
  ) {
    super(genreRepository);
  }

  async exactSearchGenres(
    searchDto: BookGenreExactSearchDto,
    pagination?: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    try {
      const whereCondition: any = {};

      // Build WHERE conditions for all provided fields (WHERE AND exact match)
      if (searchDto.name) {
        whereCondition.name = searchDto.name;
      }
      if (searchDto.description) {
        whereCondition.description = searchDto.description;
      }

      // If no search criteria provided, return empty result
      if (Object.keys(whereCondition).length === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            page: pagination?.page || 1,
            limit: pagination?.limit || 10,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      const paginationData = pagination || {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC' as 'DESC' | 'ASC',
        get offset(): number {
          return (this.page - 1) * this.limit;
        },
      };
      const options: FindManyOptions<BookGenre> = {
        where: whereCondition,
        order: { [paginationData.sortBy || 'createdAt']: paginationData.sortOrder || 'DESC' },
        skip: paginationData.offset,
        take: paginationData.limit,
      };

      return await this._findManyWithPagination(options, paginationData);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to search genres', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async simpleFilterGenres(
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    try {
      const maxLimit = Math.min(pagination.limit || 10, 50);

      // If no search term provided, return all genres with pagination
      if (!term || term.trim().length === 0) {
        const options: FindManyOptions<BookGenre> = {
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
        .createQueryBuilder('genre')
        .where('genre.deletedAt IS NULL') // Soft delete filter
        .andWhere(
          '(LOWER(genre.name) LIKE LOWER(:term) OR ' +
            'LOWER(genre.description) LIKE LOWER(:term))',
          { term: `%${trimmedTerm}%` },
        );

      // Get total count for pagination metadata
      const totalCount = await queryBuilder.getCount();

      // Apply sorting and pagination
      queryBuilder
        .orderBy(`genre.${pagination.sortBy || 'createdAt'}`, pagination.sortOrder || 'DESC')
        .skip(pagination.offset)
        .take(maxLimit);

      const genres = await queryBuilder.getMany();

      // Return using standard pagination format
      return {
        data: genres,
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

  async checkNameExists(name: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { name: name.trim() },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to check genre name existence',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findWithFilters(
    filters: BookGenreFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    try {
      const whereConditions: any = {};

      if (filters.name) {
        whereConditions.name = ILike(`%${filters.name}%`);
      }

      if (filters.description) {
        whereConditions.description = ILike(`%${filters.description}%`);
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

      const options: FindManyOptions<BookGenre> = {
        where: whereConditions,
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to filter genres', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async exportToCsv(filters: BookGenreCsvExportFiltersDto): Promise<string> {
    try {
      const whereConditions: any = {};

      if (filters.name) {
        whereConditions.name = ILike(`%${filters.name}%`);
      }

      if (filters.description) {
        whereConditions.description = ILike(`%${filters.description}%`);
      }

      if (filters.startDate && filters.endDate) {
        whereConditions.createdAt = Between(new Date(filters.startDate), new Date(filters.endDate));
      } else if (filters.startDate) {
        whereConditions.createdAt = MoreThanOrEqual(new Date(filters.startDate));
      } else if (filters.endDate) {
        whereConditions.createdAt = LessThanOrEqual(new Date(filters.endDate));
      }

      const genres = await this._findMany({
        where: whereConditions,
        order: { createdAt: 'DESC' },
      });

      const csvHeaders = 'ID,Name,Description,Created At,Updated At\n';
      const csvRows = genres
        .map((genre) => {
          const name = genre.name || 'N/A';
          const description = genre.description ? genre.description.replace(/"/g, '""') : 'N/A';
          const createdAt = genre.createdAt ? this.formatDateTimeForCsv(genre.createdAt) : 'N/A';
          const updatedAt = genre.updatedAt ? this.formatDateTimeForCsv(genre.updatedAt) : 'N/A';

          return `"${genre.id}","${name}","${description}","${createdAt}","${updatedAt}"`;
        })
        .join('\n');

      return csvHeaders + csvRows;
    } catch (error) {
      throw new HttpException('Failed to export genres to CSV', HttpStatus.INTERNAL_SERVER_ERROR);
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

  // Methods required by interface
  async searchGenres(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    return this.simpleFilterGenres(searchTerm, pagination);
  }

  async filterGenres(
    filterTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    return this.simpleFilterGenres(filterTerm, pagination);
  }
}
