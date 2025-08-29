import { Test, TestingModule } from '@nestjs/testing';
import { BookGenresController } from '../book-genres.controller';
import { BookGenreService } from '../services/book-genre.service';
import { CreateBookGenreDto, UpdateBookGenreDto } from '../dto';
import { PaginationDto } from '../../../common/dto';

describe('BookGenresController', () => {
    let controller: BookGenresController;
    let service: BookGenreService;

    const mockBookGenreService = {
        create: jest.fn(),
        findAll: jest.fn(),
        search: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookGenresController],
            providers: [
                {
                    provide: BookGenreService,
                    useValue: mockBookGenreService,
                },
            ],
        }).compile();

        controller = module.get<BookGenresController>(BookGenresController);
        service = module.get<BookGenreService>(BookGenreService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a book genre', async () => {
            const createDto = new CreateBookGenreDto();
            const req = { user: { userId: '1' } };
            await controller.create(createDto, req);
            expect(service.create).toHaveBeenCalledWith(createDto, '1');
        });
    });

    describe('findAll', () => {
        it('should find all book genres', async () => {
            const pagination = new PaginationDto();
            await controller.findAll(pagination);
            expect(service.findAll).toHaveBeenCalledWith(pagination);
        });
    });

    describe('search', () => {
        it('should search book genres', async () => {
            const pagination = new PaginationDto();
            await controller.search('test', pagination);
            expect(service.search).toHaveBeenCalledWith('test', pagination);
        });
    });

    describe('findOne', () => {
        it('should find a book genre by id', async () => {
            await controller.findOne('1');
            expect(service.findById).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a book genre', async () => {
            const updateDto = new UpdateBookGenreDto();
            const req = { user: { userId: '1' } };
            await controller.update('1', updateDto, req);
            expect(service.update).toHaveBeenCalledWith('1', updateDto, '1');
        });
    });

    describe('softDelete', () => {
        it('should remove a book genre', async () => {
            const req = { user: { userId: '1' } };
            await controller.softDelete('1', req);
            expect(service.softDelete).toHaveBeenCalledWith('1', '1');
        });
    });
});
