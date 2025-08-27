import { Injectable, NotFoundException, ConflictException, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions, ILike } from "typeorm";
import { BookGenre } from "../entities/book-genre.entity";
import { IBookGenreRepository } from "../interfaces/book-genre.repository.interface";
import { CreateBookGenreDto } from "../dto/create-book-genre.dto";
import { UpdateBookGenreDto } from "../dto/update-book-genre.dto";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { BaseRepository } from "../../../common/repositories/base.repository";

@Injectable()
export class BookGenreRepository extends BaseRepository<BookGenre> implements IBookGenreRepository {
  constructor(
    @InjectRepository(BookGenre)
    private readonly genreRepository: Repository<BookGenre>,
  ) {
    super(genreRepository);
  }

  // Public business logic methods

  async registerGenre(createBookGenreDto: CreateBookGenreDto): Promise<BookGenre> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createBookGenreDto, undefined, [
        {
          field: 'name',
          message: 'Genre name already exists',
          transform: (value: string) => value.trim()
        }
      ]);

      // Use inherited method from BaseRepository
      return await this._createEntity(createBookGenreDto);
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

  async updateGenreProfile(genreId: string, updateBookGenreDto: UpdateBookGenreDto): Promise<BookGenre> {
    try {
      const genre = await this.getGenreProfile(genreId);
      
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(updateBookGenreDto, genreId, [
        {
          field: "name",
          message: "Genre name already exists",
          transform: (value: string) => value.trim(),
        },
      ]);

      // Use inherited method from BaseRepository
      await this._updateEntity(genreId, updateBookGenreDto);
      return await this._findById(genreId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update genre profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateGenre(genreId: string): Promise<void> {
    try {
      await this.getGenreProfile(genreId); // Verify genre exists
      // Use inherited method from BaseRepository
      await this._softDelete(genreId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to deactivate genre', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchGenres(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookGenre>> {
    try {
      const options: FindManyOptions<BookGenre> = {
        where: [{ name: ILike(`%${searchTerm}%`) }, { description: ILike(`%${searchTerm}%`) }],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to search genres', HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException('Failed to get all genres', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checknameExists(name: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { name: name.trim() },
      });
    } catch (error) {
      throw new HttpException('Failed to check genre name existence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}