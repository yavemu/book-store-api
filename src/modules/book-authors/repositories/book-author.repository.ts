import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  ILike,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from 'typeorm';
import { BookAuthor } from '../entities/book-author.entity';
import { IBookAuthorCrudRepository } from '../interfaces/book-author-crud.repository.interface';
import { IBookAuthorSearchRepository } from '../interfaces/book-author-search.repository.interface';
import { IBookAuthorValidationRepository } from '../interfaces/book-author-validation.repository.interface';
import { CreateBookAuthorDto } from '../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../dto/update-book-author.dto';
import { BookAuthorFiltersDto } from '../dto/book-author-filters.dto';
import { BookAuthorCsvExportFiltersDto } from '../dto/book-author-csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class BookAuthorRepository
  extends BaseRepository<BookAuthor>
  implements IBookAuthorCrudRepository, IBookAuthorSearchRepository, IBookAuthorValidationRepository
{
  constructor(
    @InjectRepository(BookAuthor)
    private readonly authorRepository: Repository<BookAuthor>,
  ) {
    super(authorRepository);
  }

  async create(createBookAuthorDto: CreateBookAuthorDto, performedBy: string): Promise<BookAuthor> {
    return await this._create(
      createBookAuthorDto,
      performedBy,
      'BookAuthor',
      (author) => `Author registered: ${author.firstName} ${author.lastName}`,
    );
  }

  async findById(authorId: string): Promise<BookAuthor | null> {
    return await this._findById(authorId);
  }

  async update(
    authorId: string,
    updateBookAuthorDto: UpdateBookAuthorDto,
    performedBy: string,
  ): Promise<BookAuthor> {
    const entityData = {
      ...updateBookAuthorDto,
      ...(updateBookAuthorDto.birthDate && {
        birthDate: new Date(updateBookAuthorDto.birthDate),
      }),
    };

    return await this._update(
      authorId,
      entityData,
      performedBy,
      'BookAuthor',
      (author) => `Author ${author.id} updated.`,
    );
  }

  async softDelete(authorId: string, performedBy: string): Promise<{ id: string }> {
    return await this._softDelete(
      authorId,
      performedBy,
      'BookAuthor',
      (author) => `Author ${author.id} deactivated.`,
    );
  }

  async searchByTerm(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    const options: FindManyOptions<BookAuthor> = {
      where: [
        { firstName: ILike(`%${searchTerm}%`) },
        { lastName: ILike(`%${searchTerm}%`) },
        { nationality: ILike(`%${searchTerm}%`) },
      ],
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };

    return this._findManyWithPagination(options, pagination);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    const options: FindManyOptions<BookAuthor> = {
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };

    return await this._findManyWithPagination(options, pagination);
  }

  async findByNationality(
    nationality: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    const options: FindManyOptions<BookAuthor> = {
      where: { nationality },
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };

    return await this._findManyWithPagination(options, pagination);
  }

  async checkFullNameExists(firstName: string, lastName: string): Promise<boolean> {
    return await this._exists({
      where: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    });
  }

  async findByFullName(
    firstName: string,
    lastName: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    const options: FindManyOptions<BookAuthor> = {
      where: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };
    return await this._findManyWithPagination(options, pagination);
  }

  async findWithFilters(
    filters: BookAuthorFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookAuthor>> {
    const whereConditions: any = {};

    if (filters.firstName) {
      whereConditions.firstName = ILike(`%${filters.firstName}%`);
    }

    if (filters.lastName) {
      whereConditions.lastName = ILike(`%${filters.lastName}%`);
    }

    if (filters.nationality) {
      whereConditions.nationality = ILike(`%${filters.nationality}%`);
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
  }

  async exportToCsv(filters: BookAuthorCsvExportFiltersDto): Promise<string> {
    const whereConditions: any = {};

    if (filters.firstName) {
      whereConditions.firstName = ILike(`%${filters.firstName}%`);
    }

    if (filters.lastName) {
      whereConditions.lastName = ILike(`%${filters.lastName}%`);
    }

    if (filters.nationality) {
      whereConditions.nationality = ILike(`%${filters.nationality}%`);
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

    const csvHeaders = 'ID,First Name,Last Name,Nationality,Birth Date,Biography,Created At\n';
    const csvRows = authors
      .map((author) => {
        const firstName = author.firstName || 'N/A';
        const lastName = author.lastName || 'N/A';
        const nationality = author.nationality || 'N/A';
        const birthDate = author.birthDate ? this.formatDateForCsv(author.birthDate) : 'N/A';
        const biography = author.biography ? author.biography.replace(/"/g, '""') : 'N/A';
        const createdAt = author.createdAt ? author.createdAt.toISOString() : 'N/A';

        return `"${author.id}","${firstName}","${lastName}","${nationality}","${birthDate}","${biography}","${createdAt}"`;
      })
      .join('\n');

    return csvHeaders + csvRows;
  }

  /**
   * Helper method to format dates safely for CSV export
   * @private
   */
  private formatDateForCsv(date: Date | string): string {
    try {
      if (!date) return '';

      // If it's already a string in YYYY-MM-DD format, return it
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
        return date.split('T')[0];
      }

      // If it's a string, try to parse it as a Date
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().split('T')[0];
        }
        return '';
      }

      // If it's a Date object, format it
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      return '';
    } catch (error) {
      return '';
    }
  }

  // Methods required by IBookAuthorSearchRepository interface
  async exactSearchAuthors(searchDto: any): Promise<PaginatedResult<BookAuthor>> {
    const options: FindManyOptions<BookAuthor> = {
      where: { [searchDto.searchField]: searchDto.searchValue },
      order: { [searchDto.sortBy]: searchDto.sortOrder },
      skip: searchDto.offset,
      take: searchDto.limit,
    };
    return await this._findManyWithPagination(options, searchDto);
  }

  async simpleFilterAuthors(filterDto: any): Promise<PaginatedResult<BookAuthor>> {
    if (!filterDto.term || filterDto.term.trim() === '') {
      const options: FindManyOptions<BookAuthor> = {
        order: { [filterDto.sortBy]: filterDto.sortOrder },
        skip: filterDto.offset,
        take: filterDto.limit,
      };
      return await this._findManyWithPagination(options, filterDto);
    }

    const options: FindManyOptions<BookAuthor> = {
      where: [
        { firstName: ILike(`%${filterDto.term}%`) },
        { lastName: ILike(`%${filterDto.term}%`) },
        { nationality: ILike(`%${filterDto.term}%`) },
      ],
      order: { [filterDto.sortBy]: filterDto.sortOrder },
      skip: filterDto.offset,
      take: filterDto.limit,
    };

    return await this._findManyWithPagination(options, filterDto);
  }
}
