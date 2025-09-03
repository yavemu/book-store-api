import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookGenre } from '../entities/book-genre.entity';
import { IBookGenreCrudRepository } from '../interfaces';
import { PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';
import {
  ICreateBookGenreParams,
  IGetBookGenreByIdParams,
  IGetAllBookGenresParams,
  IUpdateBookGenreParams,
  IDeleteBookGenreParams,
} from '../interfaces';

@Injectable()
export class BookGenreCrudRepository
  extends BaseRepository<BookGenre>
  implements IBookGenreCrudRepository
{
  constructor(
    @InjectRepository(BookGenre)
    protected readonly repository: Repository<BookGenre>,
  ) {
    super(repository);
  }

  async createGenre(params: ICreateBookGenreParams): Promise<BookGenre> {
    return await this._create(
      params.createBookGenreDto,
      params.performedBy,
      'BookGenre',
      (genre) => `Genre created: ${genre.name}`,
    );
  }

  async getGenreById(params: IGetBookGenreByIdParams): Promise<BookGenre> {
    return await this._findById(params.genreId);
  }

  async getAllGenres(params: IGetAllBookGenresParams): Promise<PaginatedResult<BookGenre>> {
    const options = {
      order: { [params.pagination.sortBy]: params.pagination.sortOrder },
      skip: params.pagination.offset,
      take: params.pagination.limit,
    };

    return await this._findManyWithPagination(options, params.pagination);
  }

  async updateGenre(params: IUpdateBookGenreParams): Promise<BookGenre> {
    return await this._update(
      params.genreId,
      params.updateBookGenreDto,
      params.performedBy,
      'BookGenre',
      () => `Genre updated: ${params.genreId}`,
    );
  }

  async deleteGenre(params: IDeleteBookGenreParams): Promise<{ id: string }> {
    return await this._softDelete(
      params.genreId,
      params.performedBy,
      'BookGenre',
      () => `Genre deleted: ${params.genreId}`,
    );
  }

  async findByName(name: string): Promise<BookGenre> {
    return await this._findByField('name', name);
  }

  async findByNameExcludingId(name: string, excludeId: string): Promise<BookGenre> {
    return await this._findByField('name', name, { excludeId });
  }

  async checkNameExists(name: string, excludeId?: string): Promise<boolean> {
    return await this._existsByField('name', name, excludeId);
  }
}
