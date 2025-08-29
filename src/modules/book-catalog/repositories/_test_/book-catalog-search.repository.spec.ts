import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCatalogSearchRepository } from '../book-catalog-search.repository';
import { BookCatalog } from '../../entities/book-catalog.entity';
import { BookFiltersDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

const mockBookCatalog: BookCatalog = {
  id: '1',
  title: 'Test Book',
  isbnCode: '978-3-16-148410-0',
  price: 29.99,
  isAvailable: true,
  stockQuantity: 10,
  coverImageUrl: 'http://example.com/cover.jpg',
  publicationDate: new Date('2023-01-01'),
  pageCount: 300,
  summary: 'Test book summary',
  genreId: 'genre-1',
  publisherId: 'publisher-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as BookCatalog;

describe('BookCatalogSearchRepository', () => {
  let repository: BookCatalogSearchRepository;
  let typeormRepo: Repository<BookCatalog>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookCatalogSearchRepository,
        {
          provide: getRepositoryToken(BookCatalog),
          useValue: {
            count: jest.fn().mockResolvedValue(0),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              leftJoin: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[mockBookCatalog], 1]),
            }),
          },
        },
        {
          provide: 'IAuditLoggerService',
          useValue: {
            log: jest.fn(),
          },
        }
      ],
    }).compile();

    repository = module.get<BookCatalogSearchRepository>(BookCatalogSearchRepository);
    typeormRepo = module.get<Repository<BookCatalog>>(getRepositoryToken(BookCatalog));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('searchBooks', () => {
    it('should search books by term', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };
      
      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.searchBooks('test', pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result.data).toEqual([mockBookCatalog]);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findBooksWithFilters', () => {
    it('should find books with filters', async () => {
      const filters: BookFiltersDto = {
        genreId: 'genre-1',
        publisherId: 'publisher-1',
        minPrice: 10,
        maxPrice: 50,
        isAvailable: true,
      } as BookFiltersDto;
      const pagination = new PaginationDto();
      
      (repository as any)._buildPaginatedResult = jest.fn().mockReturnValue({
        data: [mockBookCatalog],
        meta: { total: 1, page: 1, limit: 10 }
      });

      const result = await repository.findBooksWithFilters(filters, pagination);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('book');
      expect(result.data).toEqual([mockBookCatalog]);
    });
  });

  describe('getBooksByGenre', () => {
    it('should get books by genre', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };
      
      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.getBooksByGenre('genre-1', pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result.data).toEqual([mockBookCatalog]);
    });
  });

  describe('getBooksByPublisher', () => {
    it('should get books by publisher', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };
      
      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.getBooksByPublisher('publisher-1', pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result.data).toEqual([mockBookCatalog]);
    });
  });

  describe('getAvailableBooks', () => {
    it('should get available books', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };
      
      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.getAvailableBooks(pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result.data).toEqual([mockBookCatalog]);
    });
  });

  describe('checkIsbnExists', () => {
    it('should check if ISBN exists and return true', async () => {
      (typeormRepo.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.checkIsbnExists('978-3-16-148410-0');

      expect(typeormRepo.count).toHaveBeenCalledWith({
        where: { isbnCode: '978-3-16-148410-0' }
      });
      expect(result).toBe(true);
    });

    it('should check if ISBN exists and return false', async () => {
      (typeormRepo.count as jest.Mock).mockResolvedValue(0);

      const result = await repository.checkIsbnExists('978-3-16-148410-1');

      expect(typeormRepo.count).toHaveBeenCalledWith({
        where: { isbnCode: '978-3-16-148410-1' }
      });
      expect(result).toBe(false);
    });
  });
});