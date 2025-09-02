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

  async exactSearchGenres(searchDto: BookGenreExactSearchDto): Promise<PaginatedResult<BookGenre>> {
    try {
      const whereCondition: any = {};
      whereCondition[searchDto.searchField] = searchDto.searchValue;

      const options: FindManyOptions<BookGenre> = {
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
      throw new HttpException('Failed to search genres', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async simpleFilterGenres(
    filterDto: BookGenreSimpleFilterDto,
  ): Promise<PaginatedResult<BookGenre>> {
    try {
      if (!filterDto.term || filterDto.term.trim() === '') {
        const options: FindManyOptions<BookGenre> = {
          order: { [filterDto.sortBy]: filterDto.sortOrder },
          skip: filterDto.offset,
          take: filterDto.limit,
        };
        return await this._findManyWithPagination(options, filterDto);
      }

      const allGenresOptions: FindManyOptions<BookGenre> = {
        order: { [filterDto.sortBy]: filterDto.sortOrder },
      };

      const allGenres = await this._findMany(allGenresOptions);
      const trimmedTerm = filterDto.term.trim().toLowerCase();

      const filteredGenres = allGenres.filter(
        (genre) =>
          (genre.name && genre.name.toLowerCase().includes(trimmedTerm)) ||
          (genre.description && genre.description.toLowerCase().includes(trimmedTerm)),
      );

      const total = filteredGenres.length;
      const startIndex = filterDto.offset || 0;
      const endIndex = startIndex + (filterDto.limit || 10);
      const paginatedData = filteredGenres.slice(startIndex, endIndex);

      return this._buildPaginatedResult(paginatedData, total, filterDto);
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
    const filterDto = {
      term: searchTerm,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      offset: pagination.offset,
      limit: pagination.limit,
      page: pagination.page,
    };
    return this.simpleFilterGenres(filterDto);
  }

  async filterGenres(
    filterTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookGenre>> {
    const filterDto = {
      term: filterTerm,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      offset: pagination.offset,
      limit: pagination.limit,
      page: pagination.page,
    };
    return this.simpleFilterGenres(filterDto);
  }
}
