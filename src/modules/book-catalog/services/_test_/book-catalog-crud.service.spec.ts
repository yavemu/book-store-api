import { Test, TestingModule } from '@nestjs/testing';
import { BookCatalogCrudService } from '../book-catalog-crud.service';
import { IBookCatalogCrudRepository } from '../../interfaces/book-catalog-crud.repository.interface';
import {
  BookCatalogMockFactory,
  RepositoryMockFactory,
  TestScenarioBuilder,
} from '../../_test_/test-utils/mock-factories';
import {
  TestConfigBuilder,
  JestConfigHelper,
  TEST_CONSTANTS,
  AssertionHelper,
} from '../../_test_/test-utils/test-config';

/**
 * BookCatalogCrudService Test Suite
 *
 * This test suite demonstrates comprehensive service testing patterns:
 * - Repository dependency injection and mocking
 * - Business logic validation
 * - Error handling and propagation
 * - Data transformation testing
 * - User context extraction testing
 *
 * This serves as a reference template for other service tests in the application.
 */
describe('BookCatalogCrudService', () => {
  let service: BookCatalogCrudService;
  let mockRepository: jest.Mocked<IBookCatalogCrudRepository>;

  // Test scenario data
  const { mockBook, mockBooks, mockPaginatedResult, createDto, updateDto, pagination, request } =
    TestScenarioBuilder.setupSuccessfulCrudOperations();

  const { notFoundError, validationError } = TestScenarioBuilder.setupErrorScenarios();

  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Create fresh mock for each test
    mockRepository = RepositoryMockFactory.createMockBookCatalogCrudRepository();

    // Create test module with dependency injection
    const module: TestingModule = await TestConfigBuilder.createTestModule([
      BookCatalogCrudService,
      {
        provide: 'IBookCatalogCrudRepository',
        useValue: mockRepository,
      },
    ]);

    service = module.get<BookCatalogCrudService>(BookCatalogCrudService);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  // =====================================
  // BASIC SETUP AND INITIALIZATION TESTS
  // =====================================

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should inject repository dependency', () => {
      expect(service).toHaveProperty('bookCatalogCrudRepository');
    });
  });

  // =====================================
  // CREATE OPERATION TESTS
  // =====================================

  describe('create()', () => {
    it('should create a new book successfully', async () => {
      // Arrange
      const expectedBook = BookCatalogMockFactory.createMockBookCatalog({
        title: createDto.title,
        isbnCode: createDto.isbnCode,
      });
      mockRepository.registerBook.mockResolvedValue(expectedBook);

      // Act
      const result = await service.create(createDto, request);

      // Assert
      expect(result).toEqual(expectedBook);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockRepository.registerBook,
        createDto,
        request.user.userId,
        request.user.username,
        request.user.role.name,
      );
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockRepository.registerBook);
      AssertionHelper.expectValidBookCatalogStructure(result);
    });

    it('should extract user context correctly', async () => {
      // Arrange
      const customRequest = BookCatalogMockFactory.createMockRequest({
        user: {
          userId: 'custom-user-id',
          username: 'customuser',
          role: { name: 'editor' },
        },
      });
      const expectedBook = BookCatalogMockFactory.createMockBookCatalog();
      mockRepository.registerBook.mockResolvedValue(expectedBook);

      // Act
      await service.create(createDto, customRequest);

      // Assert
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockRepository.registerBook,
        createDto,
        'custom-user-id',
        'customuser',
        'editor',
      );
    });

    it('should handle missing username gracefully', async () => {
      // Arrange
      const requestWithoutUsername = BookCatalogMockFactory.createMockRequest({
        user: {
          userId: 'test-user',
          role: { name: 'admin' },
        },
      });
      const expectedBook = BookCatalogMockFactory.createMockBookCatalog();
      mockRepository.registerBook.mockResolvedValue(expectedBook);

      // Act
      await service.create(createDto, requestWithoutUsername);

      // Assert
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockRepository.registerBook,
        createDto,
        'test-user',
        'Unknown User',
        'admin',
      );
    });

    it('should handle missing role gracefully', async () => {
      // Arrange
      const requestWithoutRole = BookCatalogMockFactory.createMockRequest({
        user: {
          userId: 'test-user',
          username: 'testuser',
        },
      });
      const expectedBook = BookCatalogMockFactory.createMockBookCatalog();
      mockRepository.registerBook.mockResolvedValue(expectedBook);

      // Act
      await service.create(createDto, requestWithoutRole);

      // Assert
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockRepository.registerBook,
        createDto,
        'test-user',
        'testuser',
        'user',
      );
    });

    it('should handle repository validation errors', async () => {
      // Arrange
      mockRepository.registerBook.mockRejectedValue(validationError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.create(createDto, request),
        TEST_CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED,
      );
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockRepository.registerBook);
    });

    it('should handle ISBN duplication errors', async () => {
      // Arrange
      const duplicateError = new Error(TEST_CONSTANTS.ERROR_MESSAGES.ISBN_EXISTS);
      mockRepository.registerBook.mockRejectedValue(duplicateError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.create(createDto, request),
        TEST_CONSTANTS.ERROR_MESSAGES.ISBN_EXISTS,
      );
    });
  });

  // =====================================
  // READ OPERATIONS TESTS
  // =====================================

  describe('findAll()', () => {
    it('should return paginated books list', async () => {
      // Arrange
      mockRepository.getAllBooks.mockResolvedValue(mockPaginatedResult);

      // Act
      const result = await service.findAll(pagination);

      // Assert
      expect(result).toEqual(mockPaginatedResult);
      AssertionHelper.expectMockToHaveBeenCalledWith(mockRepository.getAllBooks, pagination);
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockRepository.getAllBooks);
      AssertionHelper.expectValidPaginatedResult(result, mockBooks.length);
    });

    it('should handle empty results', async () => {
      // Arrange
      const emptyResult = BookCatalogMockFactory.createMockPaginatedResult([]);
      mockRepository.getAllBooks.mockResolvedValue(emptyResult);

      // Act
      const result = await service.findAll(pagination);

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
      AssertionHelper.expectValidPaginatedResult(result, 0);
    });

    it('should handle different pagination parameters', async () => {
      // Arrange
      const customPagination = BookCatalogMockFactory.createMockPaginationDto({
        page: 3,
        limit: 5,
        sortBy: 'title',
        sortOrder: 'ASC',
      });
      const customResult = BookCatalogMockFactory.createMockPaginatedResult(mockBooks, {
        meta: { page: 3, limit: 5, total: 20, totalPages: 4, hasNext: true, hasPrev: true },
      });
      mockRepository.getAllBooks.mockResolvedValue(customResult);

      // Act
      const result = await service.findAll(customPagination);

      // Assert
      expect(result.meta.page).toBe(3);
      expect(result.meta.limit).toBe(5);
      AssertionHelper.expectMockToHaveBeenCalledWith(mockRepository.getAllBooks, customPagination);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed');
      mockRepository.getAllBooks.mockRejectedValue(repositoryError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.findAll(pagination),
        'Database connection failed',
      );
    });
  });

  describe('findById()', () => {
    it('should return a book by ID', async () => {
      // Arrange
      mockRepository.getBookProfile.mockResolvedValue(mockBook);

      // Act
      const result = await service.findById(TEST_CONSTANTS.MOCK_IDS.BOOK);

      // Assert
      expect(result).toEqual(mockBook);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockRepository.getBookProfile,
        TEST_CONSTANTS.MOCK_IDS.BOOK,
      );
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockRepository.getBookProfile);
      AssertionHelper.expectValidBookCatalogStructure(result);
    });

    it('should handle book not found', async () => {
      // Arrange
      mockRepository.getBookProfile.mockRejectedValue(notFoundError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.findById('non-existent-id'),
        TEST_CONSTANTS.ERROR_MESSAGES.NOT_FOUND,
      );
    });

    it('should validate UUID format implicitly through repository', async () => {
      // Arrange
      const invalidId = 'invalid-uuid-format';
      const formatError = new Error('Invalid UUID format');
      mockRepository.getBookProfile.mockRejectedValue(formatError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.findById(invalidId),
        'Invalid UUID format',
      );
      AssertionHelper.expectMockToHaveBeenCalledWith(mockRepository.getBookProfile, invalidId);
    });
  });

  // =====================================
  // UPDATE OPERATION TESTS
  // =====================================

  describe('update()', () => {
    it('should update a book successfully', async () => {
      // Arrange
      const updatedBook = { ...mockBook, ...updateDto };
      mockRepository.updateBookProfile.mockResolvedValue(updatedBook);

      // Act
      const result = await service.update(
        TEST_CONSTANTS.MOCK_IDS.BOOK,
        updateDto,
        TEST_CONSTANTS.MOCK_IDS.USER,
      );

      // Assert
      expect(result).toEqual(updatedBook);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockRepository.updateBookProfile,
        TEST_CONSTANTS.MOCK_IDS.BOOK,
        updateDto,
        TEST_CONSTANTS.MOCK_IDS.USER,
      );
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockRepository.updateBookProfile);
      AssertionHelper.expectValidBookCatalogStructure(result);
    });

    it('should handle partial updates', async () => {
      // Arrange
      const partialUpdateDto = BookCatalogMockFactory.createMockUpdateDto({
        title: 'Only Title Updated',
      });
      const partiallyUpdatedBook = { ...mockBook, title: 'Only Title Updated' };
      mockRepository.updateBookProfile.mockResolvedValue(partiallyUpdatedBook);

      // Act
      const result = await service.update(
        TEST_CONSTANTS.MOCK_IDS.BOOK,
        partialUpdateDto,
        TEST_CONSTANTS.MOCK_IDS.USER,
      );

      // Assert
      expect(result.title).toBe('Only Title Updated');
      expect(result.isbnCode).toBe(mockBook.isbnCode); // Should remain unchanged
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockRepository.updateBookProfile,
        TEST_CONSTANTS.MOCK_IDS.BOOK,
        partialUpdateDto,
        TEST_CONSTANTS.MOCK_IDS.USER,
      );
    });

    it('should handle update of non-existent book', async () => {
      // Arrange
      mockRepository.updateBookProfile.mockRejectedValue(notFoundError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.update('non-existent-id', updateDto, TEST_CONSTANTS.MOCK_IDS.USER),
        TEST_CONSTANTS.ERROR_MESSAGES.NOT_FOUND,
      );
    });

    it('should handle validation errors during update', async () => {
      // Arrange
      const updateValidationError = new Error('Price must be positive');
      mockRepository.updateBookProfile.mockRejectedValue(updateValidationError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.update(TEST_CONSTANTS.MOCK_IDS.BOOK, updateDto, TEST_CONSTANTS.MOCK_IDS.USER),
        'Price must be positive',
      );
    });

    it('should handle empty update DTO', async () => {
      // Arrange
      const emptyUpdateDto = {};
      const unchangedBook = { ...mockBook };
      mockRepository.updateBookProfile.mockResolvedValue(unchangedBook);

      // Act
      const result = await service.update(
        TEST_CONSTANTS.MOCK_IDS.BOOK,
        emptyUpdateDto,
        TEST_CONSTANTS.MOCK_IDS.USER,
      );

      // Assert
      expect(result).toEqual(unchangedBook);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockRepository.updateBookProfile,
        TEST_CONSTANTS.MOCK_IDS.BOOK,
        emptyUpdateDto,
        TEST_CONSTANTS.MOCK_IDS.USER,
      );
    });
  });

  // =====================================
  // DELETE OPERATION TESTS
  // =====================================

  describe('softDelete()', () => {
    it('should soft delete a book successfully', async () => {
      // Arrange
      mockRepository.deactivateBook.mockResolvedValue(undefined);

      // Act
      const result = await service.softDelete(
        TEST_CONSTANTS.MOCK_IDS.BOOK,
        TEST_CONSTANTS.MOCK_IDS.USER,
      );

      // Assert
      expect(result).toBeUndefined();
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockRepository.deactivateBook,
        TEST_CONSTANTS.MOCK_IDS.BOOK,
        TEST_CONSTANTS.MOCK_IDS.USER,
      );
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockRepository.deactivateBook);
    });

    it('should handle deletion of non-existent book', async () => {
      // Arrange
      mockRepository.deactivateBook.mockRejectedValue(notFoundError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.softDelete('non-existent-id', TEST_CONSTANTS.MOCK_IDS.USER),
        TEST_CONSTANTS.ERROR_MESSAGES.NOT_FOUND,
      );
    });

    it('should handle deletion of already deleted book', async () => {
      // Arrange
      const alreadyDeletedError = new Error('Book is already deleted');
      mockRepository.deactivateBook.mockRejectedValue(alreadyDeletedError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.softDelete(TEST_CONSTANTS.MOCK_IDS.BOOK, TEST_CONSTANTS.MOCK_IDS.USER),
        'Book is already deleted',
      );
    });

    it('should handle authorization errors', async () => {
      // Arrange
      const authError = new Error(TEST_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED);
      mockRepository.deactivateBook.mockRejectedValue(authError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.softDelete(TEST_CONSTANTS.MOCK_IDS.BOOK, 'unauthorized-user'),
        TEST_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED,
      );
    });
  });

  // =====================================
  // INTEGRATION SCENARIOS TESTS
  // =====================================

  describe('Integration Scenarios', () => {
    it('should handle complete CRUD workflow', async () => {
      // Arrange
      const createdBook = BookCatalogMockFactory.createMockBookCatalog({
        title: createDto.title,
      });
      const updatedBook = { ...createdBook, title: 'Updated Title' };

      mockRepository.registerBook.mockResolvedValue(createdBook);
      mockRepository.getBookProfile.mockResolvedValue(createdBook);
      mockRepository.updateBookProfile.mockResolvedValue(updatedBook);
      mockRepository.deactivateBook.mockResolvedValue(undefined);

      // Act - Simulate complete workflow
      const created = await service.create(createDto, request);
      const retrieved = await service.findById(created.id);
      const updated = await service.update(
        created.id,
        { title: 'Updated Title' },
        request.user.userId,
      );
      const deleted = await service.softDelete(created.id, request.user.userId);

      // Assert
      expect(created.title).toBe(createDto.title);
      expect(retrieved.id).toBe(created.id);
      expect(updated.title).toBe('Updated Title');
      expect(deleted).toBeUndefined();

      // Verify all repository methods were called
      expect(mockRepository.registerBook).toHaveBeenCalledTimes(1);
      expect(mockRepository.getBookProfile).toHaveBeenCalledTimes(1);
      expect(mockRepository.updateBookProfile).toHaveBeenCalledTimes(1);
      expect(mockRepository.deactivateBook).toHaveBeenCalledTimes(1);
    });

    it('should handle concurrent operations', async () => {
      // Arrange
      const books = BookCatalogMockFactory.createMockBookCatalogArray(3);
      mockRepository.getBookProfile
        .mockResolvedValueOnce(books[0])
        .mockResolvedValueOnce(books[1])
        .mockResolvedValueOnce(books[2]);

      // Act - Simulate concurrent reads
      const promises = [
        service.findById(books[0].id),
        service.findById(books[1].id),
        service.findById(books[2].id),
      ];
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(3);
      expect(results[0]).toEqual(books[0]);
      expect(results[1]).toEqual(books[1]);
      expect(results[2]).toEqual(books[2]);
      expect(mockRepository.getBookProfile).toHaveBeenCalledTimes(3);
    });

    it('should maintain error consistency across operations', async () => {
      // Arrange
      const bookId = 'non-existent-book';
      mockRepository.getBookProfile.mockRejectedValue(notFoundError);
      mockRepository.updateBookProfile.mockRejectedValue(notFoundError);
      mockRepository.deactivateBook.mockRejectedValue(notFoundError);

      // Act & Assert - All operations should fail consistently
      await AssertionHelper.expectAsyncToThrow(
        () => service.findById(bookId),
        TEST_CONSTANTS.ERROR_MESSAGES.NOT_FOUND,
      );

      await AssertionHelper.expectAsyncToThrow(
        () => service.update(bookId, updateDto, TEST_CONSTANTS.MOCK_IDS.USER),
        TEST_CONSTANTS.ERROR_MESSAGES.NOT_FOUND,
      );

      await AssertionHelper.expectAsyncToThrow(
        () => service.softDelete(bookId, TEST_CONSTANTS.MOCK_IDS.USER),
        TEST_CONSTANTS.ERROR_MESSAGES.NOT_FOUND,
      );
    });
  });

  // =====================================
  // DATA TRANSFORMATION TESTS
  // =====================================

  describe('Data Transformation', () => {
    it('should preserve data integrity during operations', async () => {
      // Arrange
      const originalBook = BookCatalogMockFactory.createMockBookCatalog({
        price: 25.99,
        stockQuantity: 100,
        isAvailable: true,
      });
      mockRepository.registerBook.mockResolvedValue(originalBook);

      // Act
      const result = await service.create(createDto, request);

      // Assert
      expect(result.price).toBe(25.99);
      expect(result.stockQuantity).toBe(100);
      expect(result.isAvailable).toBe(true);
      expect(typeof result.price).toBe('number');
      expect(typeof result.stockQuantity).toBe('number');
      expect(typeof result.isAvailable).toBe('boolean');
    });

    it('should handle date transformations correctly', async () => {
      // Arrange
      const bookWithDates = BookCatalogMockFactory.createMockBookCatalog({
        publicationDate: new Date('2023-06-15'),
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-06-01T15:30:00Z'),
      });
      mockRepository.registerBook.mockResolvedValue(bookWithDates);

      // Act
      const result = await service.create(createDto, request);

      // Assert
      expect(result.publicationDate).toBeInstanceOf(Date);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.publicationDate?.getFullYear()).toBe(2023);
    });
  });
});

/**
 * This test suite demonstrates several key patterns for service testing:
 *
 * 1. **Repository Mocking**: Proper injection and mocking of repository dependencies
 * 2. **Business Logic Testing**: Validation of service-layer business rules
 * 3. **Error Propagation**: Testing how errors are handled and passed through
 * 4. **User Context Handling**: Testing extraction and use of user information
 * 5. **Data Transformation**: Ensuring data integrity through service operations
 * 6. **Integration Scenarios**: Testing complete workflows and concurrent operations
 * 7. **Edge Case Handling**: Testing boundary conditions and error scenarios
 * 8. **Mock Verification**: Proper assertion of mock method calls and parameters
 *
 * These patterns can be replicated across all other service tests in the application.
 */
