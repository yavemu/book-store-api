import { BookCatalog } from '../../entities/book-catalog.entity';
import { CreateBookCatalogDto } from '../../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../../dto/update-book-catalog.dto';
import { BookFiltersDto } from '../../dto/book-filters.dto';
import { BookExactSearchDto } from '../../dto/book-exact-search.dto';
import { BookSimpleFilterDto } from '../../dto/book-simple-filter.dto';
import { CsvExportFiltersDto } from '../../dto/csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../../common/dto/pagination.dto';
import { IBookCatalogCrudService } from '../../interfaces/book-catalog-crud.service.interface';
import { IBookCatalogSearchService } from '../../interfaces/book-catalog-search.service.interface';
import { IFileUploadService } from '../../interfaces/file-upload.service.interface';
import { IBookCatalogCrudRepository } from '../../interfaces/book-catalog-crud.repository.interface';
import { IBookCatalogSearchRepository } from '../../interfaces/book-catalog-search.repository.interface';

/**
 * Mock Factory for Book Catalog Entity
 * Provides standardized mock data generation for testing
 */
export class BookCatalogMockFactory {
  static createMockBookCatalog(overrides?: Partial<BookCatalog>): BookCatalog {
    return {
      id: 'test-book-id-123',
      title: 'Test Book Title',
      isbnCode: '9781234567890',
      price: 29.99,
      isAvailable: true,
      stockQuantity: 10,
      coverImageUrl: '/uploads/books/test-book.jpg',
      publicationDate: new Date('2023-01-01'),
      pageCount: 350,
      summary: 'A comprehensive test book for unit testing purposes.',
      genreId: 'test-genre-id-123',
      publisherId: 'test-publisher-id-123',
      genre: null,
      publisher: null,
      createdAt: new Date('2023-01-01T00:00:00Z'),
      updatedAt: new Date('2023-01-01T00:00:00Z'),
      deletedAt: null,
      ...overrides,
    };
  }

  static createMockBookCatalogArray(count: number = 3): BookCatalog[] {
    return Array.from({ length: count }, (_, index) =>
      this.createMockBookCatalog({
        id: `test-book-id-${index + 1}`,
        title: `Test Book Title ${index + 1}`,
        isbnCode: `978123456789${index}`,
        price: 20.99 + index * 5,
      }),
    );
  }

  static createMockCreateDto(overrides?: Partial<CreateBookCatalogDto>): CreateBookCatalogDto {
    return {
      title: 'New Test Book',
      isbnCode: '9780987654321',
      price: 24.99,
      isAvailable: true,
      stockQuantity: 15,
      publicationDate: new Date('2023-06-01'),
      pageCount: 280,
      summary: 'A new book for testing creation functionality.',
      genreId: 'test-genre-id-456',
      publisherId: 'test-publisher-id-456',
      ...overrides,
    };
  }

  static createMockUpdateDto(overrides?: Partial<UpdateBookCatalogDto>): UpdateBookCatalogDto {
    return {
      title: 'Updated Test Book',
      price: 34.99,
      stockQuantity: 20,
      ...overrides,
    };
  }

  static createMockPaginationDto(overrides?: Partial<PaginationDto>): PaginationDto {
    const dto = new PaginationDto();
    dto.page = overrides?.page || 1;
    dto.limit = overrides?.limit || 10;
    dto.sortBy = overrides?.sortBy || 'createdAt';
    dto.sortOrder = overrides?.sortOrder || 'DESC';
    return dto;
  }

  static createMockPaginatedResult<T>(
    data: T[],
    overrides?: Partial<PaginatedResult<T>>,
  ): PaginatedResult<T> {
    const total = overrides?.meta?.total || data.length;
    const limit = overrides?.meta?.limit || 10;
    const page = overrides?.meta?.page || 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        ...overrides?.meta,
      },
    };
  }

  static createMockBookFiltersDto(overrides?: Partial<BookFiltersDto>): BookFiltersDto {
    return {
      genreId: 'test-genre-filter-id',
      publisherId: 'test-publisher-filter-id',
      minPrice: 10.0,
      maxPrice: 50.0,
      isAvailable: true,
      ...overrides,
    };
  }

  static createMockBookExactSearchDto(overrides?: Partial<BookExactSearchDto>): BookExactSearchDto {
    const dto = new BookExactSearchDto();
    dto.title = overrides?.title || 'Cien años de soledad';
    dto.isbnCode = overrides?.isbnCode || '9788439732471';
    dto.price = overrides?.price || 25.99;
    dto.isAvailable = overrides?.isAvailable || true;
    dto.stockQuantity = overrides?.stockQuantity || 100;
    dto.genreId = overrides?.genreId || 'uuid-del-genero';
    dto.publisherId = overrides?.publisherId || 'uuid-de-la-editorial';
    return dto;
  }

  static createMockBookSimpleFilterDto(
    overrides?: Partial<BookSimpleFilterDto>,
  ): BookSimpleFilterDto {
    const dto = new BookSimpleFilterDto();
    dto.term = overrides?.term || 'test search';
    dto.page = overrides?.page || 1;
    dto.limit = overrides?.limit || 10;
    dto.sortBy = overrides?.sortBy || 'createdAt';
    dto.sortOrder = overrides?.sortOrder || 'DESC';
    return dto;
  }

  static createMockCsvExportFiltersDto(
    overrides?: Partial<CsvExportFiltersDto>,
  ): CsvExportFiltersDto {
    return {
      genreId: 'test-genre-export-id',
      publisherId: 'test-publisher-export-id',
      isAvailable: true,
      ...overrides,
    };
  }

  static createMockRequest(overrides?: any): any {
    return {
      user: {
        userId: 'test-user-id-123',
        username: 'testuser',
        role: {
          name: 'admin',
        },
        ...overrides?.user,
      },
      ...overrides,
    };
  }

  static createMockMulterFile(overrides?: Partial<Express.Multer.File>): Express.Multer.File {
    return {
      fieldname: 'coverImage',
      originalname: 'test-cover.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      destination: '/tmp',
      filename: 'test-cover-123.jpg',
      path: '/tmp/test-cover-123.jpg',
      buffer: Buffer.from('test image data'),
      stream: null,
      ...overrides,
    } as Express.Multer.File;
  }
}

/**
 * Mock Factory for Service Interfaces
 * Provides Jest mock implementations with realistic return values
 */
export class ServiceMockFactory {
  static createMockBookCatalogCrudService(): jest.Mocked<IBookCatalogCrudService> {
    return {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };
  }

  static createMockBookCatalogSearchService(): jest.Mocked<IBookCatalogSearchService> {
    return {
      exactSearch: jest.fn(),
      simpleFilter: jest.fn(),
      advancedFilter: jest.fn(),
      findByGenre: jest.fn(),
      findByPublisher: jest.fn(),
      exportToCsv: jest.fn(),
    };
  }

  static createMockFileUploadService(): jest.Mocked<IFileUploadService> {
    return {
      uploadBookCover: jest.fn(),
      deleteBookCover: jest.fn(),
      generateImageUrl: jest.fn(),
    };
  }
}

/**
 * Mock Factory for Repository Interfaces
 * Provides Jest mock implementations for repository layer testing
 */
export class RepositoryMockFactory {
  static createMockBookCatalogCrudRepository(): jest.Mocked<IBookCatalogCrudRepository> {
    return {
      registerBook: jest.fn(),
      getAllBooks: jest.fn(),
      getBookProfile: jest.fn(),
      updateBookProfile: jest.fn(),
      deactivateBook: jest.fn(),
    };
  }

  static createMockBookCatalogSearchRepository(): jest.Mocked<IBookCatalogSearchRepository> {
    return {
      exactSearchBooks: jest.fn(),
      simpleFilterBooks: jest.fn(),
      advancedFilterBooks: jest.fn(),
      getBooksByGenre: jest.fn(),
      getBooksByPublisher: jest.fn(),
      getBooksForCsvExport: jest.fn(),
    };
  }
}

/**
 * Test Scenario Builder
 * Provides common test scenarios and setup patterns
 */
export class TestScenarioBuilder {
  static setupSuccessfulCrudOperations() {
    const mockBook = BookCatalogMockFactory.createMockBookCatalog();
    const mockBooks = BookCatalogMockFactory.createMockBookCatalogArray();
    const mockPaginatedResult = BookCatalogMockFactory.createMockPaginatedResult(mockBooks);

    return {
      mockBook,
      mockBooks,
      mockPaginatedResult,
      createDto: BookCatalogMockFactory.createMockCreateDto(),
      updateDto: BookCatalogMockFactory.createMockUpdateDto(),
      pagination: BookCatalogMockFactory.createMockPaginationDto(),
      request: BookCatalogMockFactory.createMockRequest(),
    };
  }

  static setupErrorScenarios() {
    return {
      notFoundError: new Error('Book not found'),
      validationError: new Error('Validation failed'),
      duplicateError: new Error('ISBN already exists'),
      uploadError: new Error('File upload failed'),
    };
  }

  static setupFileUploadScenarios() {
    return {
      validFile: BookCatalogMockFactory.createMockMulterFile(),
      invalidFile: BookCatalogMockFactory.createMockMulterFile({
        mimetype: 'text/plain',
        originalname: 'invalid.txt',
      }),
      mockCoverUrl: '/uploads/books/test-book-cover.jpg',
    };
  }
}

/**
 * Response Mock Factory
 * Provides mock Express Response objects for controller testing
 */
export class ResponseMockFactory {
  static createMockResponse(): any {
    return {
      setHeader: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  }
}
