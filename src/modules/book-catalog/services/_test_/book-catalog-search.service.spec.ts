import { Test, TestingModule } from '@nestjs/testing';
import { BookCatalogSearchService } from '../book-catalog-search.service';
import { IBookCatalogSearchRepository } from '../../interfaces/book-catalog-search.repository.interface';
import { BookFiltersDto, CsvExportFiltersDto } from '../../dto';
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
    getBooksForCsvExport: jest.fn(),
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

  describe('exportToCsv', () => {
    const mockBookForCsv: BookCatalog = {
      id: 'book-1',
      title: 'El Quijote',
      isbnCode: '978-3-16-148410-0',
      price: 29.99,
      isAvailable: true,
      stockQuantity: 50,
      genre: { id: 'genre-1', name: 'Clásicos' } as any,
      publisher: { id: 'pub-1', name: 'Planeta' } as any,
      publicationDate: new Date('1605-01-01'),
      pageCount: 863,
      createdAt: new Date('2023-01-15'),
      summary: 'Las aventuras del ingenioso hidalgo Don Quijote de La Mancha',
      genreId: 'genre-1',
      publisherId: 'pub-1',
      updatedAt: new Date(),
      deletedAt: null,
    } as BookCatalog;

    it('should export books to CSV without filters', async () => {
      const expectedBooks = [mockBookForCsv];
      mockSearchRepository.getBooksForCsvExport.mockResolvedValue(expectedBooks);

      const result = await service.exportToCsv();

      expect(searchRepository.getBooksForCsvExport).toHaveBeenCalledWith(undefined);
      expect(result).toContain('ID,Título,ISBN,Precio,Disponible,Stock,Género,Editorial,Fecha Publicación,Páginas,Fecha Creación,Resumen');
      expect(result).toContain('book-1');
      expect(result).toContain('El Quijote');
      expect(result).toContain('978-3-16-148410-0');
      expect(result).toContain('29.99');
      expect(result).toContain('Sí');
      expect(result).toContain('50');
      expect(result).toContain('Clásicos');
      expect(result).toContain('Planeta');
      expect(result).toContain('1605-01-01');
      expect(result).toContain('863');
      expect(result).toContain('2023-01-15');
    });

    it('should export books to CSV with filters', async () => {
      const filters: CsvExportFiltersDto = {
        title: 'Quijote',
        genreId: 'genre-1',
        isAvailable: true,
        minPrice: 20,
        maxPrice: 40,
        publicationDateFrom: '1600-01-01',
        publicationDateTo: '1700-01-01'
      };
      const expectedBooks = [mockBookForCsv];
      mockSearchRepository.getBooksForCsvExport.mockResolvedValue(expectedBooks);

      const result = await service.exportToCsv(filters);

      expect(searchRepository.getBooksForCsvExport).toHaveBeenCalledWith(filters);
      expect(result).toContain('ID,Título,ISBN,Precio,Disponible,Stock,Género,Editorial,Fecha Publicación,Páginas,Fecha Creación,Resumen');
    });

    it('should handle empty book list for CSV export', async () => {
      mockSearchRepository.getBooksForCsvExport.mockResolvedValue([]);

      const result = await service.exportToCsv();

      expect(searchRepository.getBooksForCsvExport).toHaveBeenCalledWith(undefined);
      expect(result).toBe('ID,Título,ISBN,Precio,Disponible,Stock,Género,Editorial,Fecha Publicación,Páginas,Fecha Creación,Resumen');
    });

    it('should handle books with missing optional fields', async () => {
      const bookWithMissingFields: BookCatalog = {
        id: 'book-2',
        title: 'Libro Sin Datos',
        isbnCode: '978-3-16-148410-1',
        price: 15.99,
        isAvailable: false,
        stockQuantity: 0,
        genre: null,
        publisher: null,
        publicationDate: null,
        pageCount: null,
        createdAt: new Date('2023-02-01'),
        summary: null,
        genreId: 'genre-2',
        publisherId: 'pub-2',
        updatedAt: new Date(),
        deletedAt: null,
      } as BookCatalog;

      mockSearchRepository.getBooksForCsvExport.mockResolvedValue([bookWithMissingFields]);

      const result = await service.exportToCsv();

      expect(result).toContain('book-2');
      expect(result).toContain('Libro Sin Datos');
      expect(result).toContain('No');
      expect(result).toContain('Sin género');
      expect(result).toContain('Sin editorial');
      expect(result).toContain('""'); // Empty fields
    });

    it('should properly escape quotes in CSV data', async () => {
      const bookWithQuotes: BookCatalog = {
        id: 'book-3',
        title: 'El "Clásico" Libro',
        isbnCode: '978-3-16-148410-2',
        price: 25.50,
        isAvailable: true,
        stockQuantity: 10,
        genre: { id: 'genre-1', name: 'Ficción "Moderna"' } as any,
        publisher: { id: 'pub-1', name: 'Editorial "Planeta"' } as any,
        publicationDate: new Date('2023-01-01'),
        pageCount: 200,
        createdAt: new Date('2023-01-15'),
        summary: 'Un libro con "comillas" en el texto',
        genreId: 'genre-1',
        publisherId: 'pub-1',
        updatedAt: new Date(),
        deletedAt: null,
      } as BookCatalog;

      mockSearchRepository.getBooksForCsvExport.mockResolvedValue([bookWithQuotes]);

      const result = await service.exportToCsv();

      expect(result).toContain('El ""Clásico"" Libro');
      expect(result).toContain('Ficción ""Moderna""');
      expect(result).toContain('Editorial ""Planeta""');
      expect(result).toContain('Un libro con ""comillas"" en el texto');
    });
  });
});