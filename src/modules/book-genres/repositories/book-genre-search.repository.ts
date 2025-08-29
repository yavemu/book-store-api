import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { BookGenre } from '../entities/book-genre.entity';
import { IBookGenreSearchRepository } from '../interfaces/book-genre-search.repository.interface';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class BookGenreSearchRepository extends BaseRepository<BookGenre> implements IBookGenreSearchRepository {
  constructor(
    @InjectRepository(BookGenre)
    private readonly genreRepository: Repository<BookGenre>,
  ) {
    super(genreRepository);
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
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Failed to search genres", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkNameExists(name: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { name: name.trim() },
      });
    } catch (error) {
      throw new HttpException("Failed to check genre name existence", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
