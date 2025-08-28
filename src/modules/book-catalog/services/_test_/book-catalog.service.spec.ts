import { Test, TestingModule } from '@nestjs/testing';
import { BookCatalogService } from '../book-catalog.service';
import { IBookCatalogRepository } from '../../interfaces/book-catalog.repository.interface';
import { CreateBookCatalogDto, UpdateBookCatalogDto, BookFiltersDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto';

describe('BookCatalogService', () => {
    let service: BookCatalogService;
    let repository: IBookCatalogRepository;

    const mockBookCatalogRepository = {
        registerBook: jest.fn(),
        getAllBooks: jest.fn(),
        getBookProfile: jest.fn(),
        updateBookProfile: jest.fn(),
        deactivateBook: jest.fn(),
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
                BookCatalogService,
                {
                    provide: 'IBookCatalogRepository',
                    useValue: mockBookCatalogRepository,
                },
            ],
        }).compile();

        service = module.get<BookCatalogService>(BookCatalogService);
        repository = module.get<IBookCatalogRepository>('IBookCatalogRepository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a book', async () => {
            const createDto = new CreateBookCatalogDto();
            await service.create(createDto, '1');
            expect(repository.registerBook).toHaveBeenCalledWith(createDto, '1');
        });
    });

    describe('findAll', () => {
        it('should find all books', async () => {
            const pagination = new PaginationDto();
            await service.findAll(pagination);
            expect(repository.getAllBooks).toHaveBeenCalledWith(pagination);
        });
    });

    describe('findById', () => {
        it('should find a book by id', async () => {
            await service.findById('1');
            expect(repository.getBookProfile).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a book', async () => {
            const updateDto = new UpdateBookCatalogDto();
            await service.update('1', updateDto, '1');
            expect(repository.updateBookProfile).toHaveBeenCalledWith('1', updateDto, '1');
        });
    });

    describe('softDelete', () => {
        it('should soft delete a book', async () => {
            await service.softDelete('1', '1');
            expect(repository.deactivateBook).toHaveBeenCalledWith('1', '1');
        });
    });

    describe('search', () => {
        it('should search books', async () => {
            const pagination = new PaginationDto();
            await service.search('test', pagination);
            expect(repository.searchBooks).toHaveBeenCalledWith('test', pagination);
        });
    });

    describe('findWithFilters', () => {
        it('should find books with filters', async () => {
            const filters = new BookFiltersDto();
            const pagination = new PaginationDto();
            await service.findWithFilters(filters, pagination);
            expect(repository.findBooksWithFilters).toHaveBeenCalledWith(filters, pagination);
        });
    });

    describe('findByGenre', () => {
        it('should find books by genre', async () => {
            const pagination = new PaginationDto();
            await service.findByGenre('1', pagination);
            expect(repository.getBooksByGenre).toHaveBeenCalledWith('1', pagination);
        });
    });

    describe('findByPublisher', () => {
        it('should find books by publisher', async () => {
            const pagination = new PaginationDto();
            await service.findByPublisher('1', pagination);
            expect(repository.getBooksByPublisher).toHaveBeenCalledWith('1', pagination);
        });
    });

    describe('findAvailableBooks', () => {
        it('should find available books', async () => {
            const pagination = new PaginationDto();
            await service.findAvailableBooks(pagination);
            expect(repository.getAvailableBooks).toHaveBeenCalledWith(pagination);
        });
    });

    describe('checkIsbnExists', () => {
        it('should check if isbn exists', async () => {
            mockBookCatalogRepository.checkIsbnExists.mockResolvedValue(true);
            const result = await service.checkIsbnExists('123');
            expect(repository.checkIsbnExists).toHaveBeenCalledWith('123');
            expect(result).toEqual({ exists: true });
        });
    });
});
