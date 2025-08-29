import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions, ILike, Between, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import { BookCatalog } from "../entities/book-catalog.entity";
import { IBookCatalogSearchRepository } from "../interfaces/book-catalog-search.repository.interface";
import { BookFiltersDto } from "../dto/book-filters.dto";
import { CsvExportFiltersDto } from "../dto/csv-export-filters.dto";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { BaseRepository } from "../../../common/repositories/base.repository";

@Injectable()
export class BookCatalogSearchRepository extends BaseRepository<BookCatalog> implements IBookCatalogSearchRepository {
  constructor(
    @InjectRepository(BookCatalog)
    private readonly bookRepository: Repository<BookCatalog>,
  ) {
    super(bookRepository);
  }

  async searchBooks(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: [{ title: ILike(`%${searchTerm}%`) }, { isbnCode: ILike(`%${searchTerm}%`) }, { summary: ILike(`%${searchTerm}%`) }],
        relations: ["genre", "publisher"],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException("Failed to search books", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findBooksWithFilters(filters: BookFiltersDto, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const queryBuilder = this.bookRepository
        .createQueryBuilder("book")
        .leftJoinAndSelect("book.genre", "genre")
        .leftJoinAndSelect("book.publisher", "publisher");

      if (filters.title) {
        queryBuilder.andWhere("book.title ILIKE :title", {
          title: `%${filters.title}%`,
        });
      }

      if (filters.genreId) {
        queryBuilder.andWhere("book.genreId = :genreId", {
          genreId: filters.genreId,
        });
      }

      if (filters.publisherId) {
        queryBuilder.andWhere("book.publisherId = :publisherId", {
          publisherId: filters.publisherId,
        });
      }

      if (filters.isAvailable !== undefined) {
        queryBuilder.andWhere("book.isAvailable = :isAvailable", {
          isAvailable: filters.isAvailable,
        });
      }

      if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
        queryBuilder.andWhere("book.price BETWEEN :minPrice AND :maxPrice", {
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        });
      } else if (filters.minPrice !== undefined) {
        queryBuilder.andWhere("book.price >= :minPrice", {
          minPrice: filters.minPrice,
        });
      } else if (filters.maxPrice !== undefined) {
        queryBuilder.andWhere("book.price <= :maxPrice", {
          maxPrice: filters.maxPrice,
        });
      }

      if (filters.author) {
        queryBuilder
          .leftJoin("book_author_assignments", "baa", "baa.book_id = book.id")
          .leftJoin("book_authors", "author", "author.id = baa.author_id")
          .andWhere("(author.firstName ILIKE :author OR author.lastName ILIKE :author)", {
            author: `%${filters.author}%`,
          });
      }

      queryBuilder.orderBy(`book.${pagination.sortBy}`, pagination.sortOrder).skip(pagination.offset).take(pagination.limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        meta: {
          total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(total / pagination.limit),
          hasNext: pagination.page < Math.ceil(total / pagination.limit),
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      throw new HttpException("Failed to find books with filters", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBooksByGenre(genreId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: { genreId },
        relations: ["genre", "publisher"],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException("Failed to get books by genre", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBooksByPublisher(publisherId: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: { publisherId },
        relations: ["genre", "publisher"],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException("Failed to get books by publisher", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAvailableBooks(pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const options: FindManyOptions<BookCatalog> = {
        where: { isAvailable: true },
        relations: ["genre", "publisher"],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException("Failed to get available books", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkIsbnExists(isbn: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { isbnCode: isbn.trim() },
      });
    } catch (error) {
      throw new HttpException("Failed to check ISBN existence", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBooksForCsvExport(filters?: CsvExportFiltersDto): Promise<BookCatalog[]> {
    try {
      const queryBuilder = this.bookRepository
        .createQueryBuilder("book")
        .leftJoinAndSelect("book.genre", "genre")
        .leftJoinAndSelect("book.publisher", "publisher");

      // Apply filters if provided
      if (filters) {
        if (filters.title) {
          queryBuilder.andWhere("book.title ILIKE :title", {
            title: `%${filters.title}%`,
          });
        }

        if (filters.genreId) {
          queryBuilder.andWhere("book.genreId = :genreId", {
            genreId: filters.genreId,
          });
        }

        if (filters.publisherId) {
          queryBuilder.andWhere("book.publisherId = :publisherId", {
            publisherId: filters.publisherId,
          });
        }

        if (filters.isAvailable !== undefined) {
          queryBuilder.andWhere("book.isAvailable = :isAvailable", {
            isAvailable: filters.isAvailable,
          });
        }

        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
          queryBuilder.andWhere("book.price BETWEEN :minPrice AND :maxPrice", {
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
          });
        } else if (filters.minPrice !== undefined) {
          queryBuilder.andWhere("book.price >= :minPrice", {
            minPrice: filters.minPrice,
          });
        } else if (filters.maxPrice !== undefined) {
          queryBuilder.andWhere("book.price <= :maxPrice", {
            maxPrice: filters.maxPrice,
          });
        }

        if (filters.author) {
          queryBuilder
            .leftJoin("book_author_assignments", "baa", "baa.book_id = book.id")
            .leftJoin("book_authors", "author", "author.id = baa.author_id")
            .andWhere("(author.firstName ILIKE :author OR author.lastName ILIKE :author)", {
              author: `%${filters.author}%`,
            });
        }

        // Publication date range filter
        if (filters.publicationDateFrom && filters.publicationDateTo) {
          queryBuilder.andWhere("book.publicationDate BETWEEN :pubDateFrom AND :pubDateTo", {
            pubDateFrom: filters.publicationDateFrom,
            pubDateTo: filters.publicationDateTo,
          });
        } else if (filters.publicationDateFrom) {
          queryBuilder.andWhere("book.publicationDate >= :pubDateFrom", {
            pubDateFrom: filters.publicationDateFrom,
          });
        } else if (filters.publicationDateTo) {
          queryBuilder.andWhere("book.publicationDate <= :pubDateTo", {
            pubDateTo: filters.publicationDateTo,
          });
        }

        // Creation date range filter
        if (filters.createdDateFrom && filters.createdDateTo) {
          queryBuilder.andWhere("book.createdAt BETWEEN :createdFrom AND :createdTo", {
            createdFrom: filters.createdDateFrom,
            createdTo: filters.createdDateTo,
          });
        } else if (filters.createdDateFrom) {
          queryBuilder.andWhere("book.createdAt >= :createdFrom", {
            createdFrom: filters.createdDateFrom,
          });
        } else if (filters.createdDateTo) {
          queryBuilder.andWhere("book.createdAt <= :createdTo", {
            createdTo: filters.createdDateTo,
          });
        }
      }

      // Order by title for consistent CSV output
      queryBuilder.orderBy("book.title", "ASC");

      return await queryBuilder.getMany();
    } catch (error) {
      throw new HttpException("Failed to get books for CSV export", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
