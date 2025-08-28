import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorsController } from '../book-authors.controller';
import { IBookAuthorService } from '../interfaces/book-author.service.interface';
import { CreateBookAuthorDto, UpdateBookAuthorDto } from '../dto';
import { PaginationDto } from '../../../common/dto';

describe('BookAuthorsController', () => {
    let controller: BookAuthorsController;
    let service: IBookAuthorService;

    const mockBookAuthorService = {
        create: jest.fn(),
        findAll: jest.fn(),
        search: jest.fn(),
        findByFullName: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookAuthorsController],
            providers: [
                {
                    provide: 'IBookAuthorService',
                    useValue: mockBookAuthorService,
                },
            ],
        }).compile();

        controller = module.get<BookAuthorsController>(BookAuthorsController);
        service = module.get<IBookAuthorService>('IBookAuthorService');
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a book author', async () => {
            const createDto = new CreateBookAuthorDto();
            const req = { user: { id: '1' } };
            await controller.create(createDto, req);
            expect(service.create).toHaveBeenCalledWith(createDto, '1');
        });
    });

    describe('findAll', () => {
        it('should find all book authors', async () => {
            const pagination = new PaginationDto();
            await controller.findAll(pagination);
            expect(service.findAll).toHaveBeenCalledWith(pagination);
        });
    });

    describe('search', () => {
        it('should search book authors', async () => {
            const pagination = new PaginationDto();
            await controller.search('test', pagination);
            expect(service.search).toHaveBeenCalledWith('test', pagination);
        });
    });

    describe('findByFullName', () => {
        it('should find a book author by full name', async () => {
            await controller.findByFullName('John', 'Doe');
            expect(service.findByFullName).toHaveBeenCalledWith('John', 'Doe');
        });
    });

    describe('findOne', () => {
        it('should find a book author by id', async () => {
            await controller.findOne('1');
            expect(service.findById).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a book author', async () => {
            const updateDto = new UpdateBookAuthorDto();
            const req = { user: { id: '1' } };
            await controller.update('1', updateDto, req);
            expect(service.update).toHaveBeenCalledWith('1', updateDto, '1');
        });
    });

    describe('remove', () => {
        it('should remove a book author', async () => {
            const req = { user: { id: '1' } };
            await controller.remove('1', req);
            expect(service.softDelete).toHaveBeenCalledWith('1', '1');
        });
    });
});
