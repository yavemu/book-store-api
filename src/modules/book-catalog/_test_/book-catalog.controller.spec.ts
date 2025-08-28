import { Test, TestingModule } from '@nestjs/testing';
import { BookCatalogController } from '../book-catalog.controller';
import { IBookCatalogService } from '../interfaces/book-catalog.service.interface';
import { CreateBookCatalogDto, UpdateBookCatalogDto, BookFiltersDto } from '../dto';
import { PaginationDto } from '../../../common/dto';

describe('BookCatalogController', () => {
    let controller: BookCatalogController;
    let service: IBookCatalogService;

    const mockBookCatalogService = {
        create: jest.fn(),
        findAll: jest.fn(),
        search: jest.fn(),
        findWithFilters: jest.fn(),
        findAvailableBooks: jest.fn(),
        findByGenre: jest.fn(),
        findByPublisher: jest.fn(),
        checkIsbnExists: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookCatalogController],
            providers: [
                {
                    provide: 'IBookCatalogService',
                    useValue: mockBookCatalogService,
                },
            ],
        }).compile();

        controller = module.get<BookCatalogController>(BookCatalogController);
        service = module.get<IBookCatalogService>('IBookCatalogService');
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a book', async () => {
            const createDto = new CreateBookCatalogDto();
            const req = { user: { id: '1' } };
            await controller.create(createDto, req);
            expect(service.create).toHaveBeenCalledWith(createDto, '1');
        });
    });

    describe('findAll', () => {
        it('should find all books', async () => {
            const pagination = new PaginationDto();
            await controller.findAll(pagination);
            expect(service.findAll).toHaveBeenCalledWith(pagination);
        });
    });

    describe('search', () => {
        it('should search books', async () => {
            const pagination = new PaginationDto();
            await controller.search('test', pagination);
            expect(service.search).toHaveBeenCalledWith('test', pagination);
        });
    });

    describe('filter', () => {
        it('should filter books', async () => {
            const filters = new BookFiltersDto();
            const pagination = new PaginationDto();
            await controller.filter(filters, pagination);
            expect(service.findWithFilters).toHaveBeenCalledWith(filters, pagination);
        });
    });

    describe('findAvailable', () => {
        it('should find available books', async () => {
            const pagination = new PaginationDto();
            await controller.findAvailable(pagination);
            expect(service.findAvailableBooks).toHaveBeenCalledWith(pagination);
        });
    });

    describe('findByGenre', () => {
        it('should find books by genre', async () => {
            const pagination = new PaginationDto();
            await controller.findByGenre('1', pagination);
            expect(service.findByGenre).toHaveBeenCalledWith('1', pagination);
        });
    });

    describe('findByPublisher', () => {
        it('should find books by publisher', async () => {
            const pagination = new PaginationDto();
            await controller.findByPublisher('1', pagination);
            expect(service.findByPublisher).toHaveBeenCalledWith('1', pagination);
        });
    });

    describe('checkIsbn', () => {
        it('should check if isbn exists', async () => {
            await controller.checkIsbn('123');
            expect(service.checkIsbnExists).toHaveBeenCalledWith('123');
        });
    });

    describe('findOne', () => {
        it('should find a book by id', async () => {
            await controller.findOne('1');
            expect(service.findById).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a book', async () => {
            const updateDto = new UpdateBookCatalogDto();
            const req = { user: { id: '1' } };
            await controller.update('1', updateDto, req);
            expect(service.update).toHaveBeenCalledWith('1', updateDto, '1');
        });
    });

    describe('remove', () => {
        it('should remove a book', async () => {
            const req = { user: { id: '1' } };
            await controller.remove('1', req);
            expect(service.softDelete).toHaveBeenCalledWith('1', '1');
        });
    });
});
