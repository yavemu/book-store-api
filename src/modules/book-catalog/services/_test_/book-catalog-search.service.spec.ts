import { Test, TestingModule } from '@nestjs/testing';
import { BookCatalogSearchService } from '../book-catalog-search.service';
import { IBookCatalogSearchRepository } from '../../interfaces/book-catalog-search.repository.interface';
import { BookFiltersDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { BookCatalog } from '../../entities/book-catalog.entity';

describe('BookCatalogSearchService', () => {
  let service: BookCatalogSearchService;
  let searchRepository: IBookCatalogSearchRepository;

  const mockBookCatalog: BookCatalog = {
    id: '1',
    title: 'Test Book',
    isbnCode: '978-3-16-148410-0',
    publicationDate: new Date(),
    isAvailable: true,
    stockQuantity: 10,
    price: 29.99,
    genreId: 'genre-1',
    publisherId: 'publisher-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as BookCatalog;

  const mockSearchRepository = {
    searchBooks: jest.fn(),
    findBooksWithFilters: jest.fn(),
    getBooksByGenre: jest.fn(),
    getBooksByPublisher: jest.fn(),
    getAvailableBooks: jest.fn(),
    checkIsbnExists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookCatalogSearchService,
        { provide: 'IBookCatalogSearchRepository', useValue: mockSearchRepository },
      ],
    }).compile();

    service = module.get<BookCatalogSearchService>(BookCatalogSearchService);
    searchRepository = module.get<IBookCatalogSearchRepository>('IBookCatalogSearchRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should search books by term', async () => {
      const searchTerm = 'test';
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };
      mockSearchRepository.searchBooks.mockResolvedValue(paginatedResult);

      const result = await service.search(searchTerm, pagination);

      expect(searchRepository.searchBooks).toHaveBeenCalledWith(searchTerm, pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findWithFilters', () => {
    it('should find books with filters', async () => {
      const filters = new BookFiltersDto();
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };
      mockSearchRepository.findBooksWithFilters.mockResolvedValue(paginatedResult);

      const result = await service.findWithFilters(filters, pagination);

      expect(searchRepository.findBooksWithFilters).toHaveBeenCalledWith(filters, pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findByGenre', () => {
    it('should find books by genre', async () => {
      const genreId = 'genre-1';
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };
      mockSearchRepository.getBooksByGenre.mockResolvedValue(paginatedResult);

      const result = await service.findByGenre(genreId, pagination);

      expect(searchRepository.getBooksByGenre).toHaveBeenCalledWith(genreId, pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findByPublisher', () => {
    it('should find books by publisher', async () => {
      const publisherId = 'publisher-1';
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };
      mockSearchRepository.getBooksByPublisher.mockResolvedValue(paginatedResult);

      const result = await service.findByPublisher(publisherId, pagination);

      expect(searchRepository.getBooksByPublisher).toHaveBeenCalledWith(publisherId, pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findAvailableBooks', () => {
    it('should find available books', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };
      mockSearchRepository.getAvailableBooks.mockResolvedValue(paginatedResult);

      const result = await service.findAvailableBooks(pagination);

      expect(searchRepository.getAvailableBooks).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('checkIsbnExists', () => {
    it('should check if ISBN exists and return true', async () => {
      const isbn = '978-3-16-148410-0';
      mockSearchRepository.checkIsbnExists.mockResolvedValue(true);

      const result = await service.checkIsbnExists(isbn);

      expect(searchRepository.checkIsbnExists).toHaveBeenCalledWith(isbn);
      expect(result).toEqual({ exists: true });
    });

    it('should check if ISBN exists and return false', async () => {
      const isbn = '978-3-16-148410-1';
      mockSearchRepository.checkIsbnExists.mockResolvedValue(false);

      const result = await service.checkIsbnExists(isbn);

      expect(searchRepository.checkIsbnExists).toHaveBeenCalledWith(isbn);
      expect(result).toEqual({ exists: false });
    });
  });
});