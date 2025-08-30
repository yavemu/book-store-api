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

  async searchGenres(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    try {
      const options: FindManyOptions<BookGenre> = {
        where: [{ name: ILike(`%${searchTerm}%`) }, { description: ILike(`%${searchTerm}%`) }],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to search genres', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async filterGenres(
    filterTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    try {
      const options: FindManyOptions<BookGenre> = {
        where: [{ name: ILike(`%${filterTerm}%`) }, { description: ILike(`%${filterTerm}%`) }],
        order: { name: 'ASC' },
        skip: pagination.offset,
        take: Math.min(pagination.limit, 50),
        cache: {
          id: `genre_filter_${filterTerm.toLowerCase()}_${pagination.page}_${pagination.limit}`,
          milliseconds: 30000,
        },
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to filter genres', HttpStatus.INTERNAL_SERVER_ERROR);
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
          const createdAt = genre.createdAt ? genre.createdAt.toISOString() : 'N/A';
          const updatedAt = genre.updatedAt ? genre.updatedAt.toISOString() : 'N/A';

          return `"${genre.id}","${name}","${description}","${createdAt}","${updatedAt}"`;
        })
        .join('\n');

      return csvHeaders + csvRows;
    } catch (error) {
      throw new HttpException('Failed to export genres to CSV', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
