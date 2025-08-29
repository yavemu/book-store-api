import { Injectable, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions, ILike } from "typeorm";
import { BookAuthor } from "../entities/book-author.entity";
import { IBookAuthorCrudRepository } from "../interfaces/book-author-crud.repository.interface";
import { IBookAuthorSearchRepository } from "../interfaces/book-author-search.repository.interface";
import { IBookAuthorValidationRepository } from "../interfaces/book-author-validation.repository.interface";
import { CreateBookAuthorDto } from "../dto/create-book-author.dto";
import { UpdateBookAuthorDto } from "../dto/update-book-author.dto";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { BaseRepository } from "../../../common/repositories/base.repository";

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
      "BookAuthor",
      (author) => `Author registered: ${author.firstName} ${author.lastName}`,
    );
  }

  async findById(authorId: string): Promise<BookAuthor | null> {
    return await this._findById(authorId);
  }

  async update(authorId: string, updateBookAuthorDto: UpdateBookAuthorDto, performedBy: string): Promise<BookAuthor> {
    const entityData = {
      ...updateBookAuthorDto,
      ...(updateBookAuthorDto.birthDate && {
        birthDate: new Date(updateBookAuthorDto.birthDate),
      }),
    };

    return await this._update(authorId, entityData, performedBy, "BookAuthor", (author) => `Author ${author.id} updated.`);
  }

  async softDelete(authorId: string, performedBy: string): Promise<{ id: string }> {
    return await this._softDelete(authorId, performedBy, "BookAuthor", (author) => `Author ${author.id} deactivated.`);
  }

  async searchByTerm(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
    const options: FindManyOptions<BookAuthor> = {
      where: [{ firstName: ILike(`%${searchTerm}%`) }, { lastName: ILike(`%${searchTerm}%`) }, { nationality: ILike(`%${searchTerm}%`) }],
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

  async findByNationality(nationality: string, pagination: PaginationDto): Promise<PaginatedResult<BookAuthor>> {
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

  async findByFullName(firstName: string, lastName: string): Promise<BookAuthor | null> {
    return await this._findOne({
      where: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    });
  }
}
