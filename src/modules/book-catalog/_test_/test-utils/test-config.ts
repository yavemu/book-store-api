import { Test, TestingModule } from '@nestjs/testing';

/**
 * Common Test Configuration
 * Provides standardized test module setup patterns for the book-catalog module
 */
export class TestConfigBuilder {
  /**
   * Creates a test module with mocked dependencies
   * This is the standard pattern for service testing with dependency injection
   */
  static async createTestModule(providers: any[]): Promise<TestingModule> {
    return await Test.createTestingModule({
      providers,
    }).compile();
  }

  /**
   * Creates a test module with controllers and mocked services
   * This is the standard pattern for controller testing
   */
  static async createControllerTestModule(
    controllers: any[],
    providers: any[],
  ): Promise<TestingModule> {
    return await Test.createTestingModule({
      controllers,
      providers,
    }).compile();
  }
}

/**
 * Common Jest Configuration
 * Provides standardized Jest setup patterns
 */
export class JestConfigHelper {
  /**
   * Standard beforeEach setup for clearing all mocks
   */
  static setupBeforeEach(): void {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  }

  /**
   * Standard afterAll setup for cleaning up resources
   */
  static setupAfterAll(): void {
    afterAll(() => {
      jest.restoreAllMocks();
    });
  }

  /**
   * Creates a spy on console methods to suppress logs during testing
   */
  static suppressConsoleLogs(): void {
    beforeAll(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });
  }
}

/**
 * Test Constants
 * Centralized test constants for consistency across tests
 */
export const TEST_CONSTANTS = {
  MOCK_IDS: {
    BOOK: 'test-book-id-123',
    USER: 'test-user-id-123',
    GENRE: 'test-genre-id-123',
    PUBLISHER: 'test-publisher-id-123',
  },
  MOCK_ISBN_CODES: {
    VALID: '9781234567890',
    DUPLICATE: '9780987654321',
    INVALID: '123',
  },
  MOCK_URLS: {
    COVER_IMAGE: '/uploads/books/test-cover.jpg',
    UPDATED_COVER: '/uploads/books/updated-cover.jpg',
  },
  MOCK_DATES: {
    PUBLICATION: new Date('2023-01-01'),
    CREATED: new Date('2023-01-01T00:00:00Z'),
    UPDATED: new Date('2023-01-01T00:00:00Z'),
  },
  ERROR_MESSAGES: {
    NOT_FOUND: 'Book not found',
    VALIDATION_FAILED: 'Validation failed',
    ISBN_EXISTS: 'ISBN already exists',
    UPLOAD_FAILED: 'File upload failed',
    UNAUTHORIZED: 'Unauthorized access',
  },
} as const;

/**
 * Assertion Helpers
 * Common assertion patterns used across tests
 */
export class AssertionHelper {
  /**
   * Validates that a mock function was called with expected parameters
   */
  static expectMockToHaveBeenCalledWith(
    mockFn: jest.MockedFunction<any>,
    ...expectedArgs: any[]
  ): void {
    expect(mockFn).toHaveBeenCalledWith(...expectedArgs);
  }

  /**
   * Validates that a mock function was called exactly once
   */
  static expectMockToHaveBeenCalledOnce(mockFn: jest.MockedFunction<any>): void {
    expect(mockFn).toHaveBeenCalledTimes(1);
  }

  /**
   * Validates that an async function throws a specific error
   */
  static async expectAsyncToThrow(
    asyncFn: () => Promise<any>,
    errorMessage?: string,
  ): Promise<void> {
    await expect(asyncFn()).rejects.toThrow(errorMessage);
  }

  /**
   * Validates the structure of a paginated result
   */
  static expectValidPaginatedResult(result: any, expectedDataLength: number): void {
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('meta');
    expect(result.data).toHaveLength(expectedDataLength);
    expect(result.meta).toHaveProperty('total');
    expect(result.meta).toHaveProperty('page');
    expect(result.meta).toHaveProperty('limit');
    expect(result.meta).toHaveProperty('totalPages');
    expect(result.meta).toHaveProperty('hasNext');
    expect(result.meta).toHaveProperty('hasPrev');
  }

  /**
   * Validates the structure of a book catalog entity
   */
  static expectValidBookCatalogStructure(book: any): void {
    expect(book).toHaveProperty('id');
    expect(book).toHaveProperty('title');
    expect(book).toHaveProperty('isbnCode');
    expect(book).toHaveProperty('price');
    expect(book).toHaveProperty('isAvailable');
    expect(book).toHaveProperty('stockQuantity');
    expect(book).toHaveProperty('genreId');
    expect(book).toHaveProperty('publisherId');
    expect(book).toHaveProperty('createdAt');
    expect(book).toHaveProperty('updatedAt');
  }
}

/**
 * Test Data Validation
 * Utilities for validating test data consistency
 */
export class TestDataValidator {
  /**
   * Validates that a DTO has all required fields
   */
  static validateCreateDto(dto: any): boolean {
    const requiredFields = ['title', 'isbnCode', 'price', 'genreId', 'publisherId'];
    return requiredFields.every((field) => dto.hasOwnProperty(field));
  }

  /**
   * Validates that an entity has all required database fields
   */
  static validateBookEntity(entity: any): boolean {
    const requiredFields = [
      'id',
      'title',
      'isbnCode',
      'price',
      'genreId',
      'publisherId',
      'createdAt',
      'updatedAt',
    ];
    return requiredFields.every((field) => entity.hasOwnProperty(field));
  }
}
