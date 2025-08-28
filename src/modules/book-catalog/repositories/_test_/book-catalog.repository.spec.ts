import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookCatalogRepository } from '../book-catalog.repository';
import { BookCatalog } from '../../entities/book-catalog.entity';
import { CreateBookCatalogDto, UpdateBookCatalogDto, BookFiltersDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto';
import { ConflictException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

const mockBookCatalog: BookCatalog = {
    id: '1',
    title: 'Test Book',
    isbnCode: '1234567890',
    publicationDate: new Date(),
    summary: 'A test book',
    isAvailable: true,
    price: 10.00,
    genreId: '1',
    publisherId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    genre: null,
    publisher: null,
    stockQuantity: 10,
    pageCount: 100,
    coverImageUrl: '',
};

describe('BookCatalogRepository', () => {
    let repository: BookCatalogRepository;
    let bookRepo: Repository<BookCatalog>;

    const mockBookRepo = {
        findOne: jest.fn(),
        create: jest.fn().mockReturnValue(mockBookCatalog),
        save: jest.fn().mockResolvedValue(mockBookCatalog),
        softDelete: jest.fn(),
        update: jest.fn(),
        findAndCount: jest.fn(),
        count: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookCatalogRepository,
                {
                    provide: getRepositoryToken(BookCatalog),
                    useValue: mockBookRepo,
                },
                {
                    provide: 'IAuditLogService',
                    useValue: {},
                }
            ],
        }).compile();

        repository = module.get<BookCatalogRepository>(BookCatalogRepository);
        bookRepo = module.get<Repository<BookCatalog>>(getRepositoryToken(BookCatalog));
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('registerBook', () => {
        it('should register a book', async () => {
            (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
            (repository as any)._createEntity = jest.fn().mockResolvedValue(mockBookCatalog);
            const createDto = new CreateBookCatalogDto();
            createDto.publicationDate = new Date().toISOString();
            const result = await repository.registerBook(createDto);
            expect(result).toEqual(mockBookCatalog);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._validateUniqueConstraints = jest.fn().mockRejectedValue(new Error());
            const createDto = new CreateBookCatalogDto();
            await expect(repository.registerBook(createDto)).rejects.toThrow(HttpException);
        });
    });

    describe('getBookProfile', () => {
        it('should return a book profile', async () => {
            (repository as any)._findOne = jest.fn().mockResolvedValue(mockBookCatalog);
            const result = await repository.getBookProfile('1');
            expect(result).toEqual(mockBookCatalog);
        });

        it('should throw not found exception if book does not exist', async () => {
            (repository as any)._findOne = jest.fn().mockResolvedValue(null);
            await expect(repository.getBookProfile('1')).rejects.toThrow(NotFoundException);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._findOne = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getBookProfile('1')).rejects.toThrow(HttpException);
        });
    });

    describe('updateBookProfile', () => {
        it('should update a book profile', async () => {
            const updateDto = new UpdateBookCatalogDto();
            (repository as any).getBookProfile = jest.fn().mockResolvedValue(mockBookCatalog);
            (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
            (repository as any)._updateEntity = jest.fn();
            (repository as any)._findById = jest.fn().mockResolvedValue({ ...mockBookCatalog, ...updateDto });

            const result = await repository.updateBookProfile('1', updateDto);
            expect(result).toBeDefined();
        });

        it('should throw http exception on error', async () => {
            const updateDto = new UpdateBookCatalogDto();
            (repository as any).getBookProfile = jest.fn().mockRejectedValue(new Error());
            await expect(repository.updateBookProfile('1', updateDto)).rejects.toThrow(HttpException);
        });
    });

    describe('deactivateBook', () => {
        it('should deactivate a book', async () => {
            (repository as any).getBookProfile = jest.fn().mockResolvedValue(mockBookCatalog);
            (repository as any)._softDelete = jest.fn();
            await repository.deactivateBook('1');
            expect((repository as any)._softDelete).toHaveBeenCalledWith('1');
        });

        it('should throw http exception on error', async () => {
            (repository as any).getBookProfile = jest.fn().mockRejectedValue(new Error());
            await expect(repository.deactivateBook('1')).rejects.toThrow(HttpException);
        });
    });

    describe('searchBooks', () => {
        it('should search books', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.searchBooks('test', pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.searchBooks('test', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getAllBooks', () => {
        it('should get all books', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getAllBooks(pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAllBooks(pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('findBooksWithFilters', () => {
        it('should find books with filters', async () => {
            const filters = new BookFiltersDto();
            const pagination = new PaginationDto();
            const queryBuilder = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
            };
            mockBookRepo.createQueryBuilder.mockReturnValue(queryBuilder);
            await repository.findBooksWithFilters(filters, pagination);
            expect(mockBookRepo.createQueryBuilder).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const filters = new BookFiltersDto();
            const pagination = new PaginationDto();
            mockBookRepo.createQueryBuilder.mockImplementation(() => {
                throw new Error();
            });
            await expect(repository.findBooksWithFilters(filters, pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getBooksByGenre', () => {
        it('should get books by genre', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getBooksByGenre('1', pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getBooksByGenre('1', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getBooksByPublisher', () => {
        it('should get books by publisher', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getBooksByPublisher('1', pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getBooksByPublisher('1', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getAvailableBooks', () => {
        it('should get available books', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getAvailableBooks(pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAvailableBooks(pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('checkIsbnExists', () => {
        it('should check if isbn exists', async () => {
            (repository as any)._exists = jest.fn().mockResolvedValue(true);
            const result = await repository.checkIsbnExists('123');
            expect(result).toBe(true);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._exists = jest.fn().mockRejectedValue(new Error());
            await expect(repository.checkIsbnExists('123')).rejects.toThrow(HttpException);
        });
    });
});
