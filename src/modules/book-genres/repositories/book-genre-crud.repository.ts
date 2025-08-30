import { Injectable, NotFoundException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { BookGenre } from '../entities/book-genre.entity';
import { IBookGenreCrudRepository } from '../interfaces/book-genre-crud.repository.interface';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { IAuditLoggerService } from '../../../modules/audit/interfaces/audit-logger.service.interface';

@Injectable()
export class BookGenreCrudRepository
  extends BaseRepository<BookGenre>
  implements IBookGenreCrudRepository
{
  constructor(
    @InjectRepository(BookGenre)
    private readonly genreRepository: Repository<BookGenre>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService: IAuditLoggerService,
  ) {
    super(genreRepository, auditLogService);
  }

  async registerGenre(
    createBookGenreDto: CreateBookGenreDto,
    performedBy: string,
  ): Promise<BookGenre> {
    try {
      await this._validateUniqueConstraints(createBookGenreDto, undefined, [
        {
          field: 'name',
          message: 'Genre name already exists',
          transform: (value: string) => value.trim(),
        },
      ]);

      return await this._create(
        createBookGenreDto,
        performedBy,
        'BookGenre',
        (genre) => `Genre registered: ${genre.name}`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to register genre', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getGenreProfile(genreId: string): Promise<BookGenre> {
    try {
      const genre = await this._findById(genreId);
      if (!genre) {
        throw new NotFoundException('Genre not found');
      }
      return genre;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get genre profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateGenreProfile(
    genreId: string,
    updateBookGenreDto: UpdateBookGenreDto,
    performedBy: string,
  ): Promise<BookGenre> {
    try {
      await this.getGenreProfile(genreId);

      await this._validateUniqueConstraints(updateBookGenreDto, genreId, [
        {
          field: 'name',
          message: 'Genre name already exists',
          transform: (value: string) => value.trim(),
        },
      ]);

      return await this._update(
        genreId,
        updateBookGenreDto,
        performedBy,
        'BookGenre',
        (genre) => `Genre ${genre.id} updated.`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update genre profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateGenre(genreId: string, performedBy: string): Promise<{ id: string }> {
    try {
      const genre = await this.getGenreProfile(genreId);
      return await this._softDelete(
        genreId,
        performedBy,
        'BookGenre',
        () => `Genre ${genre.id} deactivated.`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to deactivate genre', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllGenres(pagination: PaginationDto): Promise<PaginatedResult<BookGenre>> {
    try {
      const options: FindManyOptions<BookGenre> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get all genres', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
