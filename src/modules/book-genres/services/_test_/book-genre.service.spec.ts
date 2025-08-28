import { Test, TestingModule } from '@nestjs/testing';
import { BookGenreService } from '../book-genre.service';
import { IBookGenreRepository } from '../../interfaces/book-genre.repository.interface';
import { CreateBookGenreDto, UpdateBookGenreDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto';
import { BookGenre } from '../../entities/book-genre.entity';

describe('BookGenreService', () => {
    let service: BookGenreService;
    let repository: IBookGenreRepository;

    const mockBookGenreRepository = {
        registerGenre: jest.fn(),
        getAllGenres: jest.fn(),
        getGenreProfile: jest.fn(),
        updateGenreProfile: jest.fn(),
        deactivateGenre: jest.fn(),
        searchGenres: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookGenreService,
                {
                    provide: 'IBookGenreRepository',
                    useValue: mockBookGenreRepository,
                },
            ],
        }).compile();

        service = module.get<BookGenreService>(BookGenreService);
        repository = module.get<IBookGenreRepository>('IBookGenreRepository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a book genre', async () => {
            const createDto = new CreateBookGenreDto();
            await service.create(createDto, '1');
            expect(repository.registerGenre).toHaveBeenCalledWith(createDto, '1');
        });
    });

    describe('findAll', () => {
        it('should find all book genres', async () => {
            const pagination = new PaginationDto();
            await service.findAll(pagination);
            expect(repository.getAllGenres).toHaveBeenCalledWith(pagination);
        });
    });

    describe('findById', () => {
        it('should find a book genre by id', async () => {
            await service.findById('1');
            expect(repository.getGenreProfile).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a book genre', async () => {
            const updateDto = new UpdateBookGenreDto();
            await service.update('1', updateDto, '1');
            expect(repository.updateGenreProfile).toHaveBeenCalledWith('1', updateDto, '1');
        });
    });

    describe('softDelete', () => {
        it('should soft delete a book genre', async () => {
            await service.softDelete('1', '1');
            expect(repository.deactivateGenre).toHaveBeenCalledWith('1', '1');
            expect(await service.softDelete('1', '1')).toEqual({ message: "Genre deleted successfully" });
        });
    });

    describe('search', () => {
        it('should search book genres', async () => {
            const pagination = new PaginationDto();
            await service.search('test', pagination);
            expect(repository.searchGenres).toHaveBeenCalledWith('test', pagination);
        });
    });
});
