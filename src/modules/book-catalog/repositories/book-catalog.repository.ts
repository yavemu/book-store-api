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

@Injectable()
export class BookCatalogRepository extends BaseRepository<BookCatalog> implements IBookCatalogRepository {
  constructor(
    @InjectRepository(BookCatalog)
    private readonly bookRepository: Repository<BookCatalog>,
  ) {
    super(bookRepository);
  }

  // Public business logic methods

  async registerBook(createBookCatalogDto: CreateBookCatalogDto): Promise<BookCatalog> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createBookCatalogDto, undefined, [
        {
          field: 'isbnCode',
          message: 'ISBN code already exists',
          transform: (value: string) => value.trim()
        }
      ]);

      // Use inherited method from BaseRepository
      return await this._createEntity(createBookCatalogDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to register book', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBookProfile(bookId: string): Promise<BookCatalog> {
    try {
      const book = await this._findOne({
        where: { id: bookId },
        relations: ['genre', 'publisher']
      });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      return book;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get book profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBookProfile(bookId: string, updateBookCatalogDto: UpdateBookCatalogDto): Promise<BookCatalog> {
    try {
      const book = await this.getBookProfile(bookId);
      
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(updateBookCatalogDto, bookId, [
        {
          field: 'isbnCode',
          message: 'ISBN code already exists',
          transform: (value: string) => value.trim()
        }
      ]);

      // Use inherited method from BaseRepository
      await this._updateEntity(bookId, updateBookCatalogDto);
      return await this.getBookProfile(bookId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update book profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateBook(bookId: string): Promise<void> {
    try {
      await this.getBookProfile(bookId); // Verify book exists
      // Use inherited method from BaseRepository
      await this._softDelete(bookId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to deactivate book', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchBooks(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: [
          { bookTitle: ILike(`%${searchTerm}%`) },
          { isbnCode: ILike(`%${searchTerm}%`) },
          { bookSummary: ILike(`%${searchTerm}%`) },
        ],
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to search books', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get all books', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBooksWithFilters(filters: BookFiltersDto, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const queryBuilder = this.bookRepository.createQueryBuilder('book')
        .leftJoinAndSelect('book.genre', 'genre')
        .leftJoinAndSelect('book.publisher', 'publisher');

      // Apply filters
      if (filters.title) {
        queryBuilder.andWhere('book.bookTitle ILIKE :title', { title: `%${filters.title}%` });
      }

      if (filters.genreId) {
        queryBuilder.andWhere('book.genreId = :genreId', { genreId: filters.genreId });
      }

      if (filters.publisherId) {
        queryBuilder.andWhere('book.publisherId = :publisherId', { publisherId: filters.publisherId });
      }

      if (filters.isAvailable !== undefined) {
        queryBuilder.andWhere('book.isAvailable = :isAvailable', { isAvailable: filters.isAvailable });
      }

      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        queryBuilder.andWhere('book.bookPrice BETWEEN :minPrice AND :maxPrice', {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice
        });
      } else if (filters.minPrice !== undefined) {
        queryBuilder.andWhere('book.bookPrice >= :minPrice', { minPrice: filters.minPrice });
      } else if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere('book.bookPrice <= :maxPrice', { maxPrice: filters.maxPrice });
      }

      if (filters.author) {
        queryBuilder.leftJoin('book_author_assignments', 'baa', 'baa.book_id = book.id')
          .leftJoin('book_authors', 'author', 'author.id = baa.author_id')
          .andWhere('(author.authorFirstName ILIKE :author OR author.authorLastName ILIKE :author)', {
            author: `%${filters.author}%`
          });
      }

      // Apply pagination and sorting
      queryBuilder
        .orderBy(`book.${pagination.sortBy}`, pagination.sortOrder)
        .skip(pagination.offset)
        .take(pagination.limit);

      const [data, total] = await queryBuilder.getManyAndCount();
      
      const totalPages = Math.ceil(total / pagination.limit);
      
      return {
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
    } catch (error) {
      throw new HttpException('Failed to find books with filters', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBooksByGenre(genreId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: { genreId },
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get books by genre', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBooksByPublisher(publisherId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: { publisherId },
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get books by publisher', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAvailableBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: { isAvailable: true },
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get available books', HttpStatus.INTERNAL_SERVER_ERROR);
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