import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookAuthor } from '../entities/book-author.entity';
import { IBookAuthorCrudRepository } from '../interfaces/book-author-crud.repository.interface';
import { CreateBookAuthorDto } from '../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../dto/update-book-author.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class BookAuthorCrudRepository
  extends BaseRepository<BookAuthor>
  implements IBookAuthorCrudRepository
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

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    const options = {
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };
    return await this._findManyWithPagination(options, pagination);
  }

  async update(
    authorId: string,
    updateBookAuthorDto: UpdateBookAuthorDto,
    performedBy: string,
  ): Promise<BookAuthor> {
    return await this._update(
      authorId,
      updateBookAuthorDto,
      performedBy,
      'BookAuthor',
      (author) => `Author updated: ${author.firstName} ${author.lastName}`,
    );
  }

  async softDelete(authorId: string, performedBy: string): Promise<{ id: string }> {
    return await this._softDelete(
      authorId,
      performedBy,
      'BookAuthor',
      (author) => `Author deleted: ${author.firstName} ${author.lastName}`,
    );
  }

  async checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
    const whereCondition: any = { email: email.trim() };

    if (excludeId) {
      whereCondition.id = { $ne: excludeId };
    }

    return await this._exists({
      where: whereCondition,
    });
  }

  async checkNameExists(firstName: string, lastName: string, excludeId?: string): Promise<boolean> {
    const whereCondition: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    if (excludeId) {
      whereCondition.id = { $ne: excludeId };
    }

    return await this._exists({
      where: whereCondition,
    });
  }

  async findForSelect(): Promise<BookAuthor[]> {
    return await this._findMany({
      select: ['id', 'firstName', 'lastName'],
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }
}
