import { Injectable, NotFoundException, HttpException, HttpStatus, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { BookCatalog } from "../entities/book-catalog.entity";
import { IBookCatalogCrudRepository } from "../interfaces/book-catalog-crud.repository.interface";
import { IBookCatalogValidationRepository } from "../interfaces/book-catalog-validation.repository.interface";
import { CreateBookCatalogDto } from "../dto/create-book-catalog.dto";
import { UpdateBookCatalogDto } from "../dto/update-book-catalog.dto";
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { PaginatedResult } from "../../../common/interfaces/paginated-result.interface";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { IAuditLoggerService } from "../../../modules/audit/interfaces/audit-logger.service.interface";

@Injectable()
export class BookCatalogCrudRepository 
  extends BaseRepository<BookCatalog> 
  implements IBookCatalogCrudRepository, IBookCatalogValidationRepository {
  constructor(
    @InjectRepository(BookCatalog)
    private readonly bookRepository: Repository<BookCatalog>,
    @Inject("IAuditLoggerService")
    protected readonly auditLogService: IAuditLoggerService,
  ) {
    super(bookRepository, auditLogService);
  }

  async registerBook(createBookCatalogDto: CreateBookCatalogDto, performedBy: string): Promise<BookCatalog> {
    try {
      await this._validateUniqueConstraints(createBookCatalogDto, undefined, [
        {
          field: "isbnCode",
          message: "ISBN code already exists",
          transform: (value: string) => value.trim(),
        },
      ]);

      const entityData = {
        ...createBookCatalogDto,
        publicationDate: new Date(createBookCatalogDto.publicationDate),
      };

      return await this._create(
        entityData,
        performedBy,
        "BookCatalog",
        (book) => `Book registered: ${book.title} (ISBN: ${book.isbnCode})`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Failed to register book", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBookProfile(bookId: string): Promise<BookCatalog> {
    try {
      const book = await this._findOne({
        where: { id: bookId },
        relations: ["genre", "publisher"],
      });
      if (!book) {
        throw new NotFoundException("Book not found");
      }
      return book;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Failed to get book profile", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBookProfile(bookId: string, updateBookCatalogDto: UpdateBookCatalogDto, performedBy: string): Promise<BookCatalog> {
    try {
      await this.getBookProfile(bookId);

      await this._validateUniqueConstraints(updateBookCatalogDto, bookId, [
        {
          field: "isbnCode",
          message: "ISBN code already exists",
          transform: (value: string) => value.trim(),
        },
      ]);

      const entityData = {
        ...updateBookCatalogDto,
        ...(updateBookCatalogDto.publicationDate && {
          publicationDate: new Date(updateBookCatalogDto.publicationDate),
        }),
      };
      return await this._update(
        bookId,
        entityData,
        performedBy,
        "BookCatalog",
        (book) => `Book ${book.id} updated.`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Failed to update book profile", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateBook(bookId: string, performedBy: string): Promise<{ id: string }> {
    try {
      const book = await this.getBookProfile(bookId);
      return await this._softDelete(
        bookId,
        performedBy,
        "BookCatalog",
        () => `Book ${book.id} deactivated.`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Failed to deactivate book", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        relations: ["genre", "publisher"],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException("Failed to get all books", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Validation methods
  async findByIsbn(isbn: string): Promise<BookCatalog> {
    return await this._findOne({
      where: {
        isbnCode: isbn.trim(),
      },
    });
  }

  async findByIsbnExcludingId(isbn: string, excludeId: string): Promise<BookCatalog> {
    return await this._findOne({
      where: {
        isbnCode: isbn.trim(),
        id: { not: excludeId } as any,
      },
    });
  }

  async _validateUniqueConstraints(dto: Partial<BookCatalog>, entityId?: string, constraints?: any[]): Promise<void> {
    if (!constraints) return;

    for (const constraint of constraints) {
      const fieldValue = dto[constraint.field];
      if (!fieldValue) continue;

      const transformedValue = constraint.transform ? constraint.transform(fieldValue) : fieldValue;
      
      let existingEntity: BookCatalog;
      if (entityId) {
        existingEntity = await this.findByIsbnExcludingId(transformedValue, entityId);
      } else {
        existingEntity = await this.findByIsbn(transformedValue);
      }

      if (existingEntity) {
        throw new Error(constraint.message);
      }
    }
  }
}
