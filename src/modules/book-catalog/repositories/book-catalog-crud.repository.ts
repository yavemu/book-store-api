import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCatalog } from '../entities/book-catalog.entity';
import { IBookCatalogCrudRepository } from '../interfaces';
import { IBookCatalogValidationRepository } from '../interfaces';
import { PaginatedResult } from '../interfaces';
import { BaseRepository } from '../../../common/repositories/base.repository';
import {
  ICreateBookCatalogParams,
  IGetBookCatalogByIdParams,
  IGetAllBookCatalogsParams,
  IUpdateBookCatalogParams,
  IDeleteBookCatalogParams,
  IFindByIsbnParams,
  IFindByIsbnExcludingIdParams,
  ICheckISBNExistsParams,
} from '../interfaces';

@Injectable()
export class BookCatalogCrudRepository
  extends BaseRepository<BookCatalog>
  implements IBookCatalogCrudRepository, IBookCatalogValidationRepository
{
  constructor(
    @InjectRepository(BookCatalog)
    protected readonly repository: Repository<BookCatalog>,
  ) {
    super(repository);
  }

  async createBook(params: ICreateBookCatalogParams): Promise<BookCatalog> {
    const entityData = {
      ...params.createBookCatalogDto,
      ...(params.createBookCatalogDto.publicationDate && {
        publicationDate: new Date(params.createBookCatalogDto.publicationDate),
      }),
    };

    return await this._create(
      entityData,
      params.performedBy,
      'BookCatalog',
      (book) => `Book created: ${book.title}`,
    );
  }

  async getBookById(params: IGetBookCatalogByIdParams): Promise<BookCatalog> {
    return await this._findOne({
      where: { id: params.id },
      relations: ['genre', 'publisher'],
    });
  }

  async updateBook(params: IUpdateBookCatalogParams): Promise<BookCatalog> {
    const entityData = {
      ...params.updateBookCatalogDto,
      ...(params.updateBookCatalogDto.publicationDate && {
        publicationDate: new Date(params.updateBookCatalogDto.publicationDate),
      }),
    };

    return await this._update(
      params.id,
      entityData,
      params.performedBy,
      'BookCatalog',
      () => `Book updated: ${params.id}`,
    );
  }

  async deleteBook(params: IDeleteBookCatalogParams): Promise<{ id: string }> {
    return await this._softDelete(
      params.id,
      params.performedBy,
      'BookCatalog',
      () => `Book deleted: ${params.id}`,
    );
  }

  async getAllBooks(params: IGetAllBookCatalogsParams): Promise<PaginatedResult<BookCatalog>> {
    const options = {
      relations: ['genre', 'publisher'],
      order: { [params.pagination.sortBy]: params.pagination.sortOrder },
      skip: params.pagination.offset,
      take: params.pagination.limit,
    };

    return await this._findManyWithPagination(options, params.pagination);
  }

  // Validation methods
  async findByIsbn(params: IFindByIsbnParams): Promise<BookCatalog> {
    return await this._findByField('isbnCode', params.isbn, {
      transform: (value) => value.trim(),
    });
  }

  async findByIsbnExcludingId(params: IFindByIsbnExcludingIdParams): Promise<BookCatalog> {
    return await this._findByField('isbnCode', params.isbn, {
      excludeId: params.excludeId,
      transform: (value) => value.trim(),
    });
  }

  async checkISBNExists(params: ICheckISBNExistsParams): Promise<boolean> {
    return await this._existsByField('isbnCode', params.isbn, params.excludeId, (value) =>
      value.trim(),
    );
  }
}
