import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookAuthor } from '../entities/book-author.entity';
import { IBookAuthorCrudRepository } from '../interfaces';
import { IBaseRepository } from '../interfaces';
import { PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';
import {
  ICreateBookAuthorParams,
  IGetBookAuthorByIdParams,
  IGetAllBookAuthorsParams,
  IUpdateBookAuthorParams,
  IDeleteBookAuthorParams,
  ICheckEmailExistsParams,
  ICheckNameExistsParams,
} from '../interfaces';

@Injectable()
export class BookAuthorCrudRepository
  extends BaseRepository<BookAuthor>
  implements Omit<IBookAuthorCrudRepository, keyof IBaseRepository<BookAuthor>>
{
  constructor(
    @InjectRepository(BookAuthor)
    protected readonly repository: Repository<BookAuthor>,
  ) {
    super(repository);
  }

  async createAuthor(params: ICreateBookAuthorParams): Promise<BookAuthor> {
    return await this._create(
      params.createBookAuthorDto,
      params.performedBy,
      'BookAuthor',
      (author) => `Author created: ${author.firstName} ${author.lastName}`,
    );
  }

  async getAuthorById(params: IGetBookAuthorByIdParams): Promise<BookAuthor | null> {
    return await this._findById(params.authorId);
  }

  async getAllAuthors(params: IGetAllBookAuthorsParams): Promise<PaginatedResult<BookAuthor>> {
    const options = {
      order: { [params.pagination.sortBy]: params.pagination.sortOrder },
      skip: params.pagination.offset,
      take: params.pagination.limit,
    };
    return await this._findManyWithPagination(options, params.pagination);
  }

  async updateAuthor(params: IUpdateBookAuthorParams): Promise<BookAuthor> {
    return await this._update(
      params.authorId,
      params.updateBookAuthorDto,
      params.performedBy,
      'BookAuthor',
      () => `Author updated: ${params.authorId}`,
    );
  }

  async deleteAuthor(params: IDeleteBookAuthorParams): Promise<{ id: string }> {
    return await this._softDelete(
      params.authorId,
      params.performedBy,
      'BookAuthor',
      () => `Author deleted: ${params.authorId}`,
    );
  }

  async checkEmailExists(params: ICheckEmailExistsParams): Promise<boolean> {
    return await this._existsByField('email', params.email, params.excludeId, (value) =>
      value.trim(),
    );
  }

  async checkNameExists(params: ICheckNameExistsParams): Promise<boolean> {
    const result = await this._findByFields(
      {
        firstName: params.firstName,
        lastName: params.lastName,
      },
      {
        excludeId: params.excludeId,
        transforms: {
          firstName: (value) => value.trim(),
          lastName: (value) => value.trim(),
        },
      },
    );
    return result !== null;
  }
}
