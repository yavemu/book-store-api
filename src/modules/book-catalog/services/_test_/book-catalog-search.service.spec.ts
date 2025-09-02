import { Test, TestingModule } from '@nestjs/testing';
import { BookCatalogSearchService } from '../book-catalog-search.service';
import { IBookCatalogSearchRepository } from '../../interfaces/book-catalog-search.repository.interface';
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
 * BookCatalogSearchService Test Suite
 *
 * This test suite demonstrates comprehensive search service testing patterns:
 * - Search repository dependency injection and mocking
 * - Multiple search operation types (exact, simple filter, advanced filter)
 * - CSV export functionality testing
 * - Pagination handling in search operations
 * - Error handling in search scenarios
 * - Data formatting and transformation
 *
 * This serves as a reference template for other search service tests in the application.
 */
describe('BookCatalogSearchService', () => {
  let service: BookCatalogSearchService;
  let mockSearchRepository: jest.Mocked<IBookCatalogSearchRepository>;

  // Test scenario data
  const { mockBook, mockBooks, mockPaginatedResult, pagination } =
    TestScenarioBuilder.setupSuccessfulCrudOperations();
  const { notFoundError, validationError } = TestScenarioBuilder.setupErrorScenarios();

  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Create fresh mock for each test
    mockSearchRepository = RepositoryMockFactory.createMockBookCatalogSearchRepository();

    // Create test module with dependency injection
    const module: TestingModule = await TestConfigBuilder.createTestModule([
      BookCatalogSearchService,
      {
        provide: 'IBookCatalogSearchRepository',
        useValue: mockSearchRepository,
      },
    ]);

    service = module.get<BookCatalogSearchService>(BookCatalogSearchService);
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

    it('should inject search repository dependency', () => {
      expect(service).toHaveProperty('bookCatalogSearchRepository');
    });
  });

  // =====================================
  // EXACT SEARCH TESTS
  // =====================================

  describe('exactSearch()', () => {
    it('should perform exact search successfully', async () => {
      // Arrange
      const searchDto = BookCatalogMockFactory.createMockBookExactSearchDto({
        searchField: 'title',
        searchValue: 'The Great Gatsby',
      });
      const searchResult = BookCatalogMockFactory.createMockPaginatedResult([mockBook]);
      mockSearchRepository.exactSearchBooks.mockResolvedValue(searchResult);

      // Act
      const result = await service.exactSearch(searchDto);

      // Assert
      expect(result).toEqual(searchResult);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockSearchRepository.exactSearchBooks,
        searchDto,
      );
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockSearchRepository.exactSearchBooks);
      AssertionHelper.expectValidPaginatedResult(result, 1);
    });

    it('should handle exact search by title only', async () => {
      // Arrange
      const searchDto = BookCatalogMockFactory.createMockBookExactSearchDto({
        searchField: 'title',
        searchValue: 'Specific Book Title',
      });
      const matchingBooks = BookCatalogMockFactory.createMockBookCatalogArray(2);
      const searchResult = BookCatalogMockFactory.createMockPaginatedResult(matchingBooks);
      mockSearchRepository.exactSearchBooks.mockResolvedValue(searchResult);

      // Act
      const result = await service.exactSearch(searchDto);

      // Assert
      expect(result.data).toHaveLength(2);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockSearchRepository.exactSearchBooks,
        searchDto,
      );
    });

    it('should handle exact search by ISBN only', async () => {
      // Arrange
      const searchDto = BookCatalogMockFactory.createMockBookExactSearchDto({
        searchField: 'isbnCode',
        searchValue: '9781234567890',
      });
      const searchResult = BookCatalogMockFactory.createMockPaginatedResult([mockBook]);
      mockSearchRepository.exactSearchBooks.mockResolvedValue(searchResult);

      // Act
      const result = await service.exactSearch(searchDto);

      // Assert
      expect(result.data).toHaveLength(1);
      AssertionHelper.expectValidBookCatalogStructure(result.data[0]);
    });

    it('should return empty results for no exact matches', async () => {
      // Arrange
      const searchDto = BookCatalogMockFactory.createMockBookExactSearchDto({
        searchField: 'title',
        searchValue: 'Non-existent Book',
      });
      const emptyResult = BookCatalogMockFactory.createMockPaginatedResult([]);
      mockSearchRepository.exactSearchBooks.mockResolvedValue(emptyResult);

      // Act
      const result = await service.exactSearch(searchDto);

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
      AssertionHelper.expectValidPaginatedResult(result, 0);
    });

    it('should handle repository errors in exact search', async () => {
      // Arrange
      const searchDto = BookCatalogMockFactory.createMockBookExactSearchDto();
      mockSearchRepository.exactSearchBooks.mockRejectedValue(validationError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.exactSearch(searchDto),
        TEST_CONSTANTS.ERROR_MESSAGES.VALIDATION_FAILED,
      );
    });
  });

  // =====================================
  // SIMPLE FILTER TESTS
  // =====================================

  describe('simpleFilter()', () => {
    it('should perform simple filter successfully', async () => {
      // Arrange
      const filterDto = BookCatalogMockFactory.createMockBookSimpleFilterDto({
        term: 'fantasy',
      });
      const filterResult = BookCatalogMockFactory.createMockPaginatedResult(mockBooks);
      mockSearchRepository.simpleFilterBooks.mockResolvedValue(filterResult);

      // Act
      const result = await service.simpleFilter(filterDto);

      // Assert
      expect(result).toEqual(filterResult);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockSearchRepository.simpleFilterBooks,
        filterDto,
      );
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockSearchRepository.simpleFilterBooks);
      AssertionHelper.expectValidPaginatedResult(result, mockBooks.length);
    });

    it('should handle simple filter by search term only', async () => {
      // Arrange
      const filterDto = BookCatalogMockFactory.createMockBookSimpleFilterDto({
        term: 'adventure',
      });
      const adventureBooks = BookCatalogMockFactory.createMockBookCatalogArray(5);
      const filterResult = BookCatalogMockFactory.createMockPaginatedResult(adventureBooks);
      mockSearchRepository.simpleFilterBooks.mockResolvedValue(filterResult);

      // Act
      const result = await service.simpleFilter(filterDto);

      // Assert
      expect(result.data).toHaveLength(5);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockSearchRepository.simpleFilterBooks,
        filterDto,
      );
    });

    it('should handle simple filter by genre only', async () => {
      // Arrange
      const filterDto = BookCatalogMockFactory.createMockBookSimpleFilterDto({
        term: 'science-fiction',
      });
      const sciFiBooks = BookCatalogMockFactory.createMockBookCatalogArray(3);
      const filterResult = BookCatalogMockFactory.createMockPaginatedResult(sciFiBooks);
      mockSearchRepository.simpleFilterBooks.mockResolvedValue(filterResult);

      // Act
      const result = await service.simpleFilter(filterDto);

      // Assert
      expect(result.data).toHaveLength(3);
      result.data.forEach((book) => {
        AssertionHelper.expectValidBookCatalogStructure(book);
      });
    });

    it('should handle empty simple filter results', async () => {
      // Arrange
      const filterDto = BookCatalogMockFactory.createMockBookSimpleFilterDto({
        term: 'nonexistentterm',
      });
      const emptyResult = BookCatalogMockFactory.createMockPaginatedResult([]);
      mockSearchRepository.simpleFilterBooks.mockResolvedValue(emptyResult);

      // Act
      const result = await service.simpleFilter(filterDto);

      // Assert
      expect(result.data).toHaveLength(0);
      AssertionHelper.expectValidPaginatedResult(result, 0);
    });

    it('should propagate repository errors in simple filter', async () => {
      // Arrange
      const filterDto = BookCatalogMockFactory.createMockBookSimpleFilterDto();
      const repositoryError = new Error('Database query failed');
      mockSearchRepository.simpleFilterBooks.mockRejectedValue(repositoryError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.simpleFilter(filterDto),
        'Database query failed',
      );
    });
  });

  // =====================================
  // ADVANCED FILTER TESTS
  // =====================================

  describe('advancedFilter()', () => {
    it('should perform advanced filter successfully', async () => {
      // Arrange
      const filtersDto = BookCatalogMockFactory.createMockBookFiltersDto({
        genreId: TEST_CONSTANTS.MOCK_IDS.GENRE,
        publisherId: TEST_CONSTANTS.MOCK_IDS.PUBLISHER,
        minPrice: 10.0,
        maxPrice: 50.0,
        isAvailable: true,
      });
      const advancedResult = BookCatalogMockFactory.createMockPaginatedResult(mockBooks);
      mockSearchRepository.advancedFilterBooks.mockResolvedValue(advancedResult);

      // Act
      const result = await service.advancedFilter(filtersDto, pagination);

      // Assert
      expect(result).toEqual(advancedResult);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockSearchRepository.advancedFilterBooks,
        filtersDto,
        pagination,
      );
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockSearchRepository.advancedFilterBooks);
      AssertionHelper.expectValidPaginatedResult(result, mockBooks.length);
    });

    it('should handle advanced filter with price range', async () => {
      // Arrange
      const filtersDto = BookCatalogMockFactory.createMockBookFiltersDto({
        minPrice: 20.0,
        maxPrice: 100.0,
      });
      const priceFilteredBooks = BookCatalogMockFactory.createMockBookCatalogArray(4);
      const filterResult = BookCatalogMockFactory.createMockPaginatedResult(priceFilteredBooks);
      mockSearchRepository.advancedFilterBooks.mockResolvedValue(filterResult);

      // Act
      const result = await service.advancedFilter(filtersDto, pagination);

      // Assert
      expect(result.data).toHaveLength(4);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockSearchRepository.advancedFilterBooks,
        filtersDto,
        pagination,
      );
    });

    it('should handle advanced filter with availability only', async () => {
      // Arrange
      const filtersDto = BookCatalogMockFactory.createMockBookFiltersDto({
        isAvailable: true,
      });
      const availableBooks = BookCatalogMockFactory.createMockBookCatalogArray(8);
      const filterResult = BookCatalogMockFactory.createMockPaginatedResult(availableBooks);
      mockSearchRepository.advancedFilterBooks.mockResolvedValue(filterResult);

      // Act
      const result = await service.advancedFilter(filtersDto, pagination);

      // Assert
      expect(result.data).toHaveLength(8);
      result.data.forEach((book) => {
        expect(book.isAvailable).toBe(true);
      });
    });

    it('should handle advanced filter with all parameters', async () => {
      // Arrange
      const comprehensiveFilters = BookCatalogMockFactory.createMockBookFiltersDto({
        genreId: 'mystery-genre-id',
        publisherId: 'premium-publisher-id',
        minPrice: 15.99,
        maxPrice: 49.99,
        isAvailable: true,
      });
      const customPagination = BookCatalogMockFactory.createMockPaginationDto({
        page: 2,
        limit: 5,
        sortBy: 'price',
        sortOrder: 'ASC',
      });
      const comprehensiveResult = BookCatalogMockFactory.createMockPaginatedResult(
        mockBooks.slice(0, 2),
        { meta: { page: 2, limit: 5, total: 12, totalPages: 3, hasNext: true, hasPrev: true } },
      );
      mockSearchRepository.advancedFilterBooks.mockResolvedValue(comprehensiveResult);

      // Act
      const result = await service.advancedFilter(comprehensiveFilters, customPagination);

      // Assert
      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(5);
      expect(result.meta.total).toBe(12);
    });

    it('should handle empty advanced filter results', async () => {
      // Arrange
      const restrictiveFilters = BookCatalogMockFactory.createMockBookFiltersDto({
        minPrice: 1000.0,
        maxPrice: 2000.0,
      });
      const emptyResult = BookCatalogMockFactory.createMockPaginatedResult([]);
      mockSearchRepository.advancedFilterBooks.mockResolvedValue(emptyResult);

      // Act
      const result = await service.advancedFilter(restrictiveFilters, pagination);

      // Assert
      expect(result.data).toHaveLength(0);
      AssertionHelper.expectValidPaginatedResult(result, 0);
    });
  });

  // =====================================
  // GENRE AND PUBLISHER SPECIFIC TESTS
  // =====================================

  describe('findByGenre()', () => {
    it('should find books by genre successfully', async () => {
      // Arrange
      const genreId = 'fantasy-genre-id';
      const fantasyBooks = BookCatalogMockFactory.createMockBookCatalogArray(6);
      const genreResult = BookCatalogMockFactory.createMockPaginatedResult(fantasyBooks);
      mockSearchRepository.getBooksByGenre.mockResolvedValue(genreResult);

      // Act
      const result = await service.findByGenre(genreId, pagination);

      // Assert
      expect(result).toEqual(genreResult);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockSearchRepository.getBooksByGenre,
        genreId,
        pagination,
      );
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockSearchRepository.getBooksByGenre);
      AssertionHelper.expectValidPaginatedResult(result, fantasyBooks.length);
    });

    it('should handle non-existent genre', async () => {
      // Arrange
      const nonExistentGenreId = 'non-existent-genre';
      const emptyResult = BookCatalogMockFactory.createMockPaginatedResult([]);
      mockSearchRepository.getBooksByGenre.mockResolvedValue(emptyResult);

      // Act
      const result = await service.findByGenre(nonExistentGenreId, pagination);

      // Assert
      expect(result.data).toHaveLength(0);
      AssertionHelper.expectValidPaginatedResult(result, 0);
    });

    it('should handle invalid genre ID format', async () => {
      // Arrange
      const invalidGenreId = 'invalid-uuid';
      const formatError = new Error('Invalid UUID format');
      mockSearchRepository.getBooksByGenre.mockRejectedValue(formatError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.findByGenre(invalidGenreId, pagination),
        'Invalid UUID format',
      );
    });
  });

  describe('findByPublisher()', () => {
    it('should find books by publisher successfully', async () => {
      // Arrange
      const publisherId = 'penguin-publisher-id';
      const publisherBooks = BookCatalogMockFactory.createMockBookCatalogArray(4);
      const publisherResult = BookCatalogMockFactory.createMockPaginatedResult(publisherBooks);
      mockSearchRepository.getBooksByPublisher.mockResolvedValue(publisherResult);

      // Act
      const result = await service.findByPublisher(publisherId, pagination);

      // Assert
      expect(result).toEqual(publisherResult);
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockSearchRepository.getBooksByPublisher,
        publisherId,
        pagination,
      );
      AssertionHelper.expectMockToHaveBeenCalledOnce(mockSearchRepository.getBooksByPublisher);
      AssertionHelper.expectValidPaginatedResult(result, publisherBooks.length);
    });

    it('should handle different pagination for publisher search', async () => {
      // Arrange
      const publisherId = 'academic-publisher-id';
      const customPagination = BookCatalogMockFactory.createMockPaginationDto({
        page: 3,
        limit: 15,
        sortBy: 'publicationDate',
        sortOrder: 'DESC',
      });
      const academicBooks = BookCatalogMockFactory.createMockBookCatalogArray(10);
      const publisherResult = BookCatalogMockFactory.createMockPaginatedResult(academicBooks, {
        meta: { page: 3, limit: 15, total: 45, totalPages: 3, hasNext: false, hasPrev: true },
      });
      mockSearchRepository.getBooksByPublisher.mockResolvedValue(publisherResult);

      // Act
      const result = await service.findByPublisher(publisherId, customPagination);

      // Assert
      expect(result.meta.page).toBe(3);
      expect(result.meta.limit).toBe(15);
      expect(result.meta.total).toBe(45);
    });
  });

  // =====================================
  // CSV EXPORT TESTS
  // =====================================

  describe('exportToCsv()', () => {
    it('should export books to CSV successfully without filters', async () => {
      // Arrange
      const exportBooks = BookCatalogMockFactory.createMockBookCatalogArray(3);
      mockSearchRepository.getBooksForCsvExport.mockResolvedValue(exportBooks);

      // Act
      const result = await service.exportToCsv();

      // Assert
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockSearchRepository.getBooksForCsvExport,
        undefined,
      );
      expect(typeof result).toBe('string');
      expect(result).toContain('ID,Título,ISBN'); // Updated to match actual CSV headers
      expect(result.split('\n').length).toBeGreaterThan(1); // At least header + data rows
    });

    it('should export books to CSV with filters', async () => {
      // Arrange
      const csvFilters = BookCatalogMockFactory.createMockCsvExportFiltersDto({
        genreId: 'fiction-genre-id',
        isAvailable: true,
      });
      const filteredBooks = BookCatalogMockFactory.createMockBookCatalogArray(2);
      mockSearchRepository.getBooksForCsvExport.mockResolvedValue(filteredBooks);

      // Act
      const result = await service.exportToCsv(csvFilters);

      // Assert
      AssertionHelper.expectMockToHaveBeenCalledWith(
        mockSearchRepository.getBooksForCsvExport,
        csvFilters,
      );
      expect(typeof result).toBe('string');
      expect(result).toContain('ID,Título,ISBN'); // Check for CSV headers
      expect(result.split('\n').length).toBe(filteredBooks.length + 1); // Header + data rows
    });

    it('should handle empty export results', async () => {
      // Arrange
      const csvFilters = BookCatalogMockFactory.createMockCsvExportFiltersDto();
      const emptyBooks: any[] = [];
      mockSearchRepository.getBooksForCsvExport.mockResolvedValue(emptyBooks);

      // Act
      const result = await service.exportToCsv(csvFilters);

      // Assert
      expect(typeof result).toBe('string');
      expect(result).toContain('ID,Título,ISBN'); // Should contain headers
      expect(result.split('\n')).toHaveLength(1); // Only header row
    });

    it('should handle CSV export repository errors', async () => {
      // Arrange
      const csvFilters = BookCatalogMockFactory.createMockCsvExportFiltersDto();
      const exportError = new Error('Export query failed');
      mockSearchRepository.getBooksForCsvExport.mockRejectedValue(exportError);

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.exportToCsv(csvFilters),
        'Export query failed',
      );
    });
  });

  // =====================================
  // INTEGRATION SCENARIOS TESTS
  // =====================================

  describe('Integration Scenarios', () => {
    it('should handle multiple search operations concurrently', async () => {
      // Arrange
      const exactSearchDto = BookCatalogMockFactory.createMockBookExactSearchDto();
      const simpleFilterDto = BookCatalogMockFactory.createMockBookSimpleFilterDto();
      const advancedFiltersDto = BookCatalogMockFactory.createMockBookFiltersDto();

      const exactResult = BookCatalogMockFactory.createMockPaginatedResult([mockBook]);
      const simpleResult = BookCatalogMockFactory.createMockPaginatedResult(mockBooks);
      const advancedResult = BookCatalogMockFactory.createMockPaginatedResult(
        mockBooks.slice(0, 2),
      );

      mockSearchRepository.exactSearchBooks.mockResolvedValue(exactResult);
      mockSearchRepository.simpleFilterBooks.mockResolvedValue(simpleResult);
      mockSearchRepository.advancedFilterBooks.mockResolvedValue(advancedResult);

      // Act - Simulate concurrent search operations
      const promises = [
        service.exactSearch(exactSearchDto),
        service.simpleFilter(simpleFilterDto),
        service.advancedFilter(advancedFiltersDto, pagination),
      ];
      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(3);
      expect(results[0].data).toHaveLength(1);
      expect(results[1].data).toHaveLength(mockBooks.length);
      expect(results[2].data).toHaveLength(2);

      // Verify all repository methods were called
      expect(mockSearchRepository.exactSearchBooks).toHaveBeenCalledTimes(1);
      expect(mockSearchRepository.simpleFilterBooks).toHaveBeenCalledTimes(1);
      expect(mockSearchRepository.advancedFilterBooks).toHaveBeenCalledTimes(1);
    });

    it('should maintain search consistency across different operation types', async () => {
      // Arrange
      const searchTerm = 'specific-book';
      const exactSearchDto = BookCatalogMockFactory.createMockBookExactSearchDto({
        searchField: 'title',
        searchValue: searchTerm,
      });
      const simpleFilterDto = BookCatalogMockFactory.createMockBookSimpleFilterDto({
        term: searchTerm,
      });

      const sameBook = BookCatalogMockFactory.createMockBookCatalog({
        title: searchTerm,
      });
      const exactResult = BookCatalogMockFactory.createMockPaginatedResult([sameBook]);
      const filterResult = BookCatalogMockFactory.createMockPaginatedResult([sameBook]);

      mockSearchRepository.exactSearchBooks.mockResolvedValue(exactResult);
      mockSearchRepository.simpleFilterBooks.mockResolvedValue(filterResult);

      // Act
      const exactSearchResult = await service.exactSearch(exactSearchDto);
      const simpleFilterResult = await service.simpleFilter(simpleFilterDto);

      // Assert
      expect(exactSearchResult.data[0].id).toBe(simpleFilterResult.data[0].id);
      expect(exactSearchResult.data[0].title).toBe(searchTerm);
      expect(simpleFilterResult.data[0].title).toBe(searchTerm);
    });
  });

  // =====================================
  // ERROR HANDLING TESTS
  // =====================================

  describe('Error Handling', () => {
    it('should handle repository connection errors consistently', async () => {
      // Arrange
      const connectionError = new Error('Database connection lost');
      mockSearchRepository.exactSearchBooks.mockRejectedValue(connectionError);
      mockSearchRepository.simpleFilterBooks.mockRejectedValue(connectionError);
      mockSearchRepository.advancedFilterBooks.mockRejectedValue(connectionError);

      const searchDto = BookCatalogMockFactory.createMockBookExactSearchDto();
      const filterDto = BookCatalogMockFactory.createMockBookSimpleFilterDto();
      const advancedDto = BookCatalogMockFactory.createMockBookFiltersDto();

      // Act & Assert - All operations should fail with the same error
      await AssertionHelper.expectAsyncToThrow(
        () => service.exactSearch(searchDto),
        'Database connection lost',
      );

      await AssertionHelper.expectAsyncToThrow(
        () => service.simpleFilter(filterDto),
        'Database connection lost',
      );

      await AssertionHelper.expectAsyncToThrow(
        () => service.advancedFilter(advancedDto, pagination),
        'Database connection lost',
      );
    });

    it('should handle malformed search parameters', async () => {
      // Arrange
      const malformedError = new Error('Invalid search parameters');
      mockSearchRepository.exactSearchBooks.mockRejectedValue(malformedError);

      const invalidSearchDto = {} as any;

      // Act & Assert
      await AssertionHelper.expectAsyncToThrow(
        () => service.exactSearch(invalidSearchDto),
        'Invalid search parameters',
      );
    });
  });
});

/**
 * This test suite demonstrates several key patterns for search service testing:
 *
 * 1. **Search Repository Mocking**: Proper injection and mocking of search repository dependencies
 * 2. **Multiple Search Types**: Testing exact search, simple filter, and advanced filter operations
 * 3. **Pagination Handling**: Proper testing of paginated search results
 * 4. **CSV Export Testing**: Testing data export functionality with various scenarios
 * 5. **Filter Combinations**: Testing different filter parameter combinations
 * 6. **Error Propagation**: Testing how search errors are handled and passed through
 * 7. **Concurrent Operations**: Testing multiple search operations running simultaneously
 * 8. **Data Consistency**: Ensuring search results maintain data integrity
 * 9. **Edge Cases**: Testing boundary conditions like empty results and invalid parameters
 * 10. **Integration Scenarios**: Testing complex search workflows and operation combinations
 *
 * These patterns can be replicated across all other search service tests in the application.
 */
