import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { BookGenre } from '../entities/book-genre.entity';
import { IBookGenreRepository } from '../interfaces/book-genre.repository.interface';
import { CreateBookGenreDto } from '../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../dto/update-book-genre.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';
import { SUCCESS_MESSAGES } from '../../../common/exceptions/success-messages';

@Injectable()
export class BookGenreRepository
  extends BaseRepository<BookGenre>
  implements IBookGenreRepository
{
  constructor(
    @InjectRepository(BookGenre)
    private readonly genreRepository: Repository<BookGenre>,
  ) {
    super(genreRepository);
  }

  // Public business logic methods

  async registerGenre(
    createBookGenreDto: CreateBookGenreDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<BookGenre>> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createBookGenreDto, undefined, [
        {
          field: 'name',
          message: 'Genre name already exists',
          transform: (value: string) => value.trim(),
        },
      ]);

      return await this._createEntity(
        createBookGenreDto,
        SUCCESS_MESSAGES.BOOK_GENRES.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to register genre',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGenreProfile(
    genreId: string,
  ): Promise<SuccessResponseDto<BookGenre>> {
    try {
      const genre = await this._findById(genreId);
      if (!genre) {
        throw new NotFoundException('Genre not found');
      }
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_GENRES.FOUND_ONE,
        genre,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get genre profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateGenreProfile(
    genreId: string,
    updateBookGenreDto: UpdateBookGenreDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<BookGenre>> {
    try {
      await this.getGenreProfile(genreId);

      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(updateBookGenreDto, genreId, [
        {
          field: 'name',
          message: 'Genre name already exists',
          transform: (value: string) => value.trim(),
        },
      ]);

      // Use inherited method with audit from BaseRepository
      return await this._updateEntity(
        genreId,
        updateBookGenreDto,
        SUCCESS_MESSAGES.BOOK_GENRES.UPDATED,
        performedBy,
        'BookGenre',
        (entity: BookGenre) => `Updated book genre: ${entity.name}`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update genre profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deactivateGenre(
    genreId: string,
  ): Promise<SuccessResponseDto<{ id: string }>> {
    try {
      await this.getGenreProfile(genreId); // Verify genre exists
      // Use inherited method from BaseRepository
      return await this._softDelete(
        genreId,
        SUCCESS_MESSAGES.BOOK_GENRES.DELETED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to deactivate genre',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchGenres(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookGenre>>> {
    try {
      const options: FindManyOptions<BookGenre> = {
        where: [
          { name: ILike(`%${searchTerm}%`) },
          { description: ILike(`%${searchTerm}%`) },
        ],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_GENRES.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to search genres',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllGenres(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookGenre>>> {
    try {
      const options: FindManyOptions<BookGenre> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_GENRES.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get all genres',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checknameExists(name: string): Promise<boolean> {
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
}
