import { Injectable, NotFoundException, ConflictException, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions, ILike, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { BookCatalog } from "../entities/book-catalog.entity";
import { IBookCatalogRepository } from "../interfaces/book-catalog.repository.interface";
import { CreateBookCatalogDto } from "../dto/create-book-catalog.dto";
import { UpdateBookCatalogDto } from "../dto/update-book-catalog.dto";
import { BookFiltersDto } from "../dto/book-filters.dto";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { BaseRepository } from "../../../common/repositories/base.repository";
import { SuccessResponseDto } from "../../../common/dto/success-response.dto";
import { SUCCESS_MESSAGES } from "../../../common/exceptions/success-messages";

@Injectable()
export class BookCatalogRepository extends BaseRepository<BookCatalog> implements IBookCatalogRepository {
  constructor(
    @InjectRepository(BookCatalog)
    private readonly bookRepository: Repository<BookCatalog>,
  ) {
    super(bookRepository);
  }

  // Public business logic methods

  async registerBook(
    createBookCatalogDto: CreateBookCatalogDto,
  ): Promise<SuccessResponseDto<BookCatalog>> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createBookCatalogDto, undefined, [
        {
          field: 'isbnCode',
          message: 'ISBN code already exists',
          transform: (value: string) => value.trim(),
        },
      ]);

      // Use inherited method from BaseRepository
      const entityData = {
        ...createBookCatalogDto,
        publicationDate: new Date(createBookCatalogDto.publicationDate),
      };
      return await this._createEntity(
        entityData,
        SUCCESS_MESSAGES.BOOK_CATALOG.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to register book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBookProfile(
    bookId: string,
  ): Promise<SuccessResponseDto<BookCatalog>> {
    try {
      const book = await this._findOne({
        where: { id: bookId },
        relations: ['genre', 'publisher'],
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_CATALOG.FOUND_ONE,
        book,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get book profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBookProfile(
    bookId: string,
    updateBookCatalogDto: UpdateBookCatalogDto,
  ): Promise<SuccessResponseDto<BookCatalog>> {
    try {
      await this.getBookProfile(bookId);

      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(updateBookCatalogDto, bookId, [
        {
          field: 'isbnCode',
          message: 'ISBN code already exists',
          transform: (value: string) => value.trim(),
        },
      ]);

      // Use inherited method from BaseRepository
      const entityData = {
        ...updateBookCatalogDto,
        ...(updateBookCatalogDto.publicationDate && {
          publicationDate: new Date(updateBookCatalogDto.publicationDate),
        }),
      };
      return await this._updateEntity(
        bookId,
        entityData,
        SUCCESS_MESSAGES.BOOK_CATALOG.UPDATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update book profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deactivateBook(
    bookId: string,
  ): Promise<SuccessResponseDto<{ id: string }>> {
    try {
      await this.getBookProfile(bookId); // Verify book exists
      // Use inherited method from BaseRepository
      return await this._softDelete(
        bookId,
        SUCCESS_MESSAGES.BOOK_CATALOG.DELETED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to deactivate book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchBooks(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: [
          { title: ILike(`%${searchTerm}%`) },
          { isbnCode: ILike(`%${searchTerm}%`) },
          { summary: ILike(`%${searchTerm}%`) },
        ],
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_CATALOG.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to search books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllBooks(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_CATALOG.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get all books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBooksWithFilters(
    filters: BookFiltersDto,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>> {
    try {
      const queryBuilder = this.bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.genre', 'genre')
        .leftJoinAndSelect('book.publisher', 'publisher');

      // Apply filters
      if (filters.title) {
        queryBuilder.andWhere('book.title ILIKE :title', {
          title: `%${filters.title}%`,
        });
      }

      if (filters.genreId) {
        queryBuilder.andWhere('book.genreId = :genreId', {
          genreId: filters.genreId,
        });
      }

      if (filters.publisherId) {
        queryBuilder.andWhere('book.publisherId = :publisherId', {
          publisherId: filters.publisherId,
        });
      }

      if (filters.isAvailable !== undefined) {
        queryBuilder.andWhere('book.isAvailable = :isAvailable', {
          isAvailable: filters.isAvailable,
        });
      }

      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        queryBuilder.andWhere('book.price BETWEEN :minPrice AND :maxPrice', {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        });
      } else if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('book.price >= :minPrice', {
          minPrice: filters.minPrice,
        });
      } else if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('book.price <= :maxPrice', {
          maxPrice: filters.maxPrice,
        });
      }

      if (filters.author) {
        queryBuilder
          .leftJoin('book_author_assignments', 'baa', 'baa.book_id = book.id')
          .leftJoin('book_authors', 'author', 'author.id = baa.author_id')
          .andWhere(
            '(author.firstName ILIKE :author OR author.lastName ILIKE :author)',
            {
              author: `%${filters.author}%`,
            },
          );
      }

      // Apply pagination and sorting
      queryBuilder
        .orderBy(`book.${pagination.sortBy}`, pagination.sortOrder)
        .skip(pagination.offset)
        .take(pagination.limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      const totalPages = Math.ceil(total / pagination.limit);

      const paginatedResult = {
        data,
        meta: {
          total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      };

      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_CATALOG.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to find books with filters',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBooksByGenre(
    genreId: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: { genreId },
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_CATALOG.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get books by genre',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBooksByPublisher(
    publisherId: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: { publisherId },
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_CATALOG.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get books by publisher',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAvailableBooks(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<BookCatalog>>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: { isAvailable: true },
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.BOOK_CATALOG.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get available books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkIsbnExists(isbn: string): Promise<boolean> {
    try {
      return await this._exists({ 
        where: { isbnCode: isbn.trim() } 
      });
    } catch (error) {
      throw new HttpException('Failed to check ISBN existence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}