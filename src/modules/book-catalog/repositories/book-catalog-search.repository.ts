import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { BookCatalog } from '../entities/book-catalog.entity';
import { IBookCatalogSearchRepository } from '../interfaces/book-catalog-search.repository.interface';
import { BookFiltersDto } from '../dto/book-filters.dto';
import { BookExactSearchDto } from '../dto/book-exact-search.dto';
import { CsvExportFiltersDto } from '../dto/csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class BookCatalogSearchRepository
  extends BaseRepository<BookCatalog>
  implements IBookCatalogSearchRepository
{
  constructor(
    @InjectRepository(BookCatalog)
    private readonly bookRepository: Repository<BookCatalog>,
  ) {
    super(bookRepository);
  }

  async exactSearchBooks(searchDto: BookExactSearchDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      // Validate search field
      if (!['title', 'isbnCode', 'author', 'genre', 'publisher'].includes(searchDto.searchField)) {
        throw new HttpException('Invalid search field', HttpStatus.BAD_REQUEST);
      }

      // Validate and sanitize search value
      if (!searchDto.searchValue || searchDto.searchValue.trim().length === 0) {
        throw new HttpException('Search value cannot be empty', HttpStatus.BAD_REQUEST);
      }

      const trimmedSearchValue = searchDto.searchValue.trim();
      let options: FindManyOptions<BookCatalog>;

      // Apply EXACT search logic based on field using BaseRepository methods
      switch (searchDto.searchField) {
        case 'title':
          options = {
            where: { title: trimmedSearchValue },
            relations: ['genre', 'publisher'],
            order: { [searchDto.sortBy]: searchDto.sortOrder },
            skip: searchDto.offset,
            take: searchDto.limit,
          };
          break;
        case 'isbnCode':
          options = {
            where: { isbnCode: trimmedSearchValue },
            relations: ['genre', 'publisher'],
            order: { [searchDto.sortBy]: searchDto.sortOrder },
            skip: searchDto.offset,
            take: searchDto.limit,
          };
          break;
        case 'genre':
          options = {
            where: { genre: { name: trimmedSearchValue } },
            relations: ['genre', 'publisher'],
            order: { [searchDto.sortBy]: searchDto.sortOrder },
            skip: searchDto.offset,
            take: searchDto.limit,
          };
          break;
        case 'publisher':
          options = {
            where: { publisher: { name: trimmedSearchValue } },
            relations: ['genre', 'publisher'],
            order: { [searchDto.sortBy]: searchDto.sortOrder },
            skip: searchDto.offset,
            take: searchDto.limit,
          };
          break;
        default:
          // For complex searches like 'author', use a simpler approach with BaseRepository
          throw new HttpException(
            'Author search not supported in exact mode',
            HttpStatus.BAD_REQUEST,
          );
      }

      return await this._findManyWithPagination(options, searchDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to perform exact search', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async simpleFilterBooks(term: string, pagination: PaginationDto): Promise<PaginatedResult<BookCatalog>> {
    try {
      const maxLimit = Math.min(pagination.limit || 10, 50);
      
      // If no search term provided, return all books with pagination using BaseRepository
      if (!term || term.trim().length === 0) {
        const options: FindManyOptions<BookCatalog> = {
          relations: ['genre', 'publisher'],
          order: { [pagination.sortBy || 'createdAt']: pagination.sortOrder || 'DESC' },
          skip: pagination.offset,
          take: maxLimit,
        };
        return await this._findManyWithPagination(options, pagination);
      }

      // Validate minimum search term length
      const trimmedTerm = term.trim();
      if (trimmedTerm.length < 3) {
        throw new HttpException(
          'Search term must be at least 3 characters long',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Use TypeORM QueryBuilder for efficient LIKE queries across all fields
      const queryBuilder = this.repository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.genre', 'genre')
        .leftJoinAndSelect('book.publisher', 'publisher')
        .where('book.deletedAt IS NULL') // Soft delete filter
        .andWhere(
          '(LOWER(book.title) LIKE LOWER(:term) OR ' +
          'LOWER(book.isbnCode) LIKE LOWER(:term) OR ' +
          'LOWER(book.summary) LIKE LOWER(:term) OR ' +
          'CAST(book.publicationYear AS VARCHAR) LIKE :term OR ' +
          'CAST(book.stockQuantity AS VARCHAR) LIKE :term OR ' +
          'CAST(book.price AS VARCHAR) LIKE :term OR ' +
          'LOWER(genre.name) LIKE LOWER(:term) OR ' +
          'LOWER(publisher.name) LIKE LOWER(:term))',
          { term: `%${trimmedTerm}%` }
        );

      // Get total count for pagination metadata
      const totalCount = await queryBuilder.getCount();

      // Apply sorting and pagination
      queryBuilder
        .orderBy(`book.${pagination.sortBy || 'createdAt'}`, pagination.sortOrder || 'DESC')
        .skip(pagination.offset)
        .take(maxLimit);

      const books = await queryBuilder.getMany();

      // Return using standard pagination format
      return {
        data: books,
        meta: {
          total: totalCount,
          page: pagination.page,
          limit: maxLimit,
          totalPages: Math.ceil(totalCount / maxLimit),
          hasNext: pagination.offset + maxLimit < totalCount,
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to perform simple filter', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async advancedFilterBooks(
    filters: BookFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>> {
    try {
      // Validate filter parameters
      if (filters.minPrice !== undefined && filters.minPrice < 0) {
        throw new HttpException('Minimum price cannot be negative', HttpStatus.BAD_REQUEST);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice < 0) {
        throw new HttpException('Maximum price cannot be negative', HttpStatus.BAD_REQUEST);
      }
      if (
        filters.minPrice !== undefined &&
        filters.maxPrice !== undefined &&
        filters.minPrice > filters.maxPrice
      ) {
        throw new HttpException(
          'Minimum price cannot be greater than maximum price',
          HttpStatus.BAD_REQUEST,
        );
      }

      // For advanced filtering with complex conditions, we need to get all books
      // and filter in memory due to BaseRepository method limitations
      const allBooksOptions: FindManyOptions<BookCatalog> = {
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy || 'createdAt']: pagination.sortOrder || 'DESC' },
      };

      const allBooks = await this._findMany(allBooksOptions);

      // Filter books in memory based on criteria
      const filteredBooks = allBooks.filter((book) => {
        // Title filter (partial match)
        if (filters.title && filters.title.trim()) {
          const titleMatch =
            book.title && book.title.toLowerCase().includes(filters.title.trim().toLowerCase());
          if (!titleMatch) return false;
        }

        // Genre filter (exact match)
        if (filters.genreId) {
          if (book.genreId !== filters.genreId) return false;
        }

        // Publisher filter (exact match)
        if (filters.publisherId) {
          if (book.publisherId !== filters.publisherId) return false;
        }

        // Availability filter
        if (filters.isAvailable !== undefined) {
          if (book.isAvailable !== filters.isAvailable) return false;
        }

        // Price range filters
        if (filters.minPrice !== undefined && book.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && book.price > filters.maxPrice) {
          return false;
        }

        // Note: Author search would require additional queries to book_author_assignments
        // This is a limitation of using only BaseRepository methods for complex joins
        if (filters.author && filters.author.trim()) {
          // Skip author filtering for now due to BaseRepository limitations with joins
          console.warn('Author filtering skipped - requires complex join operations');
        }

        return true;
      });

      // Apply pagination manually
      const total = filteredBooks.length;
      const startIndex = pagination.offset;
      const endIndex = startIndex + pagination.limit;
      const paginatedData = filteredBooks.slice(startIndex, endIndex);

      return this._buildPaginatedResult(paginatedData, total, pagination);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to perform advanced filter',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBooksByGenre(
    genreId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>> {
    try {
      // Validate genreId parameter
      if (!genreId || genreId.trim().length === 0) {
        throw new HttpException('Genre ID is required', HttpStatus.BAD_REQUEST);
      }

      const trimmedGenreId = genreId.trim();
      const options: FindManyOptions<BookCatalog> = {
        where: { genreId: trimmedGenreId },
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy || 'createdAt']: pagination.sortOrder || 'DESC' },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get books by genre', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBooksByPublisher(
    publisherId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<BookCatalog>> {
    try {
      // Validate publisherId parameter
      if (!publisherId || publisherId.trim().length === 0) {
        throw new HttpException('Publisher ID is required', HttpStatus.BAD_REQUEST);
      }

      const trimmedPublisherId = publisherId.trim();
      const options: FindManyOptions<BookCatalog> = {
        where: { publisherId: trimmedPublisherId },
        relations: ['genre', 'publisher'],
        order: { [pagination.sortBy || 'createdAt']: pagination.sortOrder || 'DESC' },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get books by publisher', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBooksForCsvExport(filters?: CsvExportFiltersDto): Promise<BookCatalog[]> {
    try {
      // Get all books with relations for filtering
      const allBooksOptions: FindManyOptions<BookCatalog> = {
        relations: ['genre', 'publisher'],
        order: { title: 'ASC' }, // Order by title for consistent CSV output
      };

      const allBooks = await this._findMany(allBooksOptions);

      // Apply filters if provided
      if (!filters) {
        return allBooks;
      }

      const filteredBooks = allBooks.filter((book) => {
        // Title filter (partial match)
        if (filters.title && filters.title.trim()) {
          const titleMatch =
            book.title && book.title.toLowerCase().includes(filters.title.trim().toLowerCase());
          if (!titleMatch) return false;
        }

        // Genre filter (exact match)
        if (filters.genreId) {
          if (book.genreId !== filters.genreId) return false;
        }

        // Publisher filter (exact match)
        if (filters.publisherId) {
          if (book.publisherId !== filters.publisherId) return false;
        }

        // Availability filter
        if (filters.isAvailable !== undefined) {
          if (book.isAvailable !== filters.isAvailable) return false;
        }

        // Price range filters
        if (filters.minPrice !== undefined && book.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && book.price > filters.maxPrice) {
          return false;
        }

        // Publication date range filter
        if (filters.publicationDateFrom || filters.publicationDateTo) {
          const publicationDate = book.publicationDate;
          if (publicationDate) {
            if (filters.publicationDateFrom) {
              const fromDate = new Date(filters.publicationDateFrom);
              if (publicationDate < fromDate) return false;
            }
            if (filters.publicationDateTo) {
              const toDate = new Date(filters.publicationDateTo);
              if (publicationDate > toDate) return false;
            }
          }
        }

        // Creation date range filter
        if (filters.createdDateFrom || filters.createdDateTo) {
          const createdAt = book.createdAt;
          if (filters.createdDateFrom) {
            const fromDate = new Date(filters.createdDateFrom);
            if (createdAt < fromDate) return false;
          }
          if (filters.createdDateTo) {
            const toDate = new Date(filters.createdDateTo);
            if (createdAt > toDate) return false;
          }
        }

        // Note: Author search would require additional queries to book_author_assignments
        // This is a limitation of using only BaseRepository methods for complex joins
        if (filters.author && filters.author.trim()) {
          // Skip author filtering for now due to BaseRepository limitations with joins
          console.warn(
            'Author filtering skipped for CSV export - requires complex join operations',
          );
        }

        return true;
      });

      return filteredBooks;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get books for CSV export',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Helper method to build paginated result using BaseRepository pattern
   * @private
   */
  protected _buildPaginatedResult<T extends PaginationDto>(
    data: BookCatalog[],
    total: number,
    pagination: T,
  ): PaginatedResult<BookCatalog> {
    return {
      data,
      meta: {
        total,
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        totalPages: Math.ceil(total / (pagination.limit || 10)),
        hasNext: (pagination.page || 1) < Math.ceil(total / (pagination.limit || 10)),
        hasPrev: (pagination.page || 1) > 1,
      },
    };
  }
}
