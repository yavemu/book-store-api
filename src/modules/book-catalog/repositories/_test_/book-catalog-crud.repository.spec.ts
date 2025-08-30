import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCatalogCrudRepository } from '../book-catalog-crud.repository';
import { BookCatalog } from '../../entities/book-catalog.entity';
import { CreateBookCatalogDto, UpdateBookCatalogDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { IAuditLoggerService } from '../../../audit/interfaces/audit-logger.service.interface';

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

describe('BookCatalogCrudRepository', () => {
  let repository: BookCatalogCrudRepository;
  let typeormRepo: Repository<BookCatalog>;
  let auditLoggerService: IAuditLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookCatalogCrudRepository,
        {
          provide: getRepositoryToken(BookCatalog),
          useValue: {
            create: jest.fn().mockReturnValue(mockBookCatalog),
            save: jest.fn().mockResolvedValue(mockBookCatalog),
            findOne: jest.fn().mockResolvedValue(mockBookCatalog),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
            findAndCount: jest.fn().mockResolvedValue([[mockBookCatalog], 1]),
            count: jest.fn().mockResolvedValue(0),
          },
        },
        {
          provide: 'IAuditLoggerService',
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<BookCatalogCrudRepository>(BookCatalogCrudRepository);
    typeormRepo = module.get<Repository<BookCatalog>>(getRepositoryToken(BookCatalog));
    auditLoggerService = module.get<IAuditLoggerService>('IAuditLoggerService');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('registerBook', () => {
    it('should register a book', async () => {
      const createDto: CreateBookCatalogDto = {
        title: 'Test Book',
        isbnCode: '978-3-16-148410-0',
        price: 29.99,
        stockQuantity: 10,
        genreId: 'genre-1',
        publisherId: 'publisher-1',
        publicationDate: new Date('2023-01-01'),
      } as CreateBookCatalogDto;

      (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
      (repository as any)._create = jest.fn().mockResolvedValue(mockBookCatalog);

      const result = await repository.registerBook(createDto, 'test-user');

      expect((repository as any)._validateUniqueConstraints).toHaveBeenCalled();
      expect((repository as any)._create).toHaveBeenCalled();
      expect(result).toEqual(mockBookCatalog);
    });

    it('should throw error if ISBN already exists', async () => {
      const createDto: CreateBookCatalogDto = {
        title: 'Test Book',
        isbnCode: '978-3-16-148410-0',
        price: 29.99,
        stockQuantity: 10,
        genreId: 'genre-1',
        publisherId: 'publisher-1',
        publicationDate: new Date('2023-01-01'),
      } as CreateBookCatalogDto;

      (repository as any)._validateUniqueConstraints = jest
        .fn()
        .mockRejectedValue(new HttpException('ISBN code already exists', HttpStatus.CONFLICT));

      await expect(repository.registerBook(createDto, 'test-user')).rejects.toThrow(HttpException);
    });
  });

  describe('getBookProfile', () => {
    it('should return a book profile', async () => {
      (repository as any)._findOne = jest.fn().mockResolvedValue(mockBookCatalog);

      const result = await repository.getBookProfile('1');

      expect((repository as any)._findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['genre', 'publisher'],
      });
      expect(result).toEqual(mockBookCatalog);
    });
  });

  describe('updateBookProfile', () => {
    it('should update a book profile', async () => {
      const updateDto: UpdateBookCatalogDto = { title: 'Updated Book Title' };
      const updatedBook = { ...mockBookCatalog, ...updateDto };

      (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
      (repository as any)._update = jest.fn().mockResolvedValue(updatedBook);

      const result = await repository.updateBookProfile('1', updateDto, 'test-user');

      expect((repository as any)._validateUniqueConstraints).toHaveBeenCalled();
      expect((repository as any)._update).toHaveBeenCalled();
      expect(result).toEqual(updatedBook);
    });
  });

  describe('deactivateBook', () => {
    it('should deactivate a book', async () => {
      (repository as any)._softDelete = jest.fn().mockResolvedValue(undefined);

      await repository.deactivateBook('1', 'test-user');

      expect((repository as any)._softDelete).toHaveBeenCalledWith(
        '1',
        'test-user',
        'BookCatalog',
        expect.any(Function),
      );
    });
  });

  describe('getAllBooks', () => {
    it('should get all books', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };

      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.getAllBooks(pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result).toEqual(paginatedResult);
    });
  });
});
