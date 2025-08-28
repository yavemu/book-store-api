import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorService } from '../book-author.service';
import { IBookAuthorRepository } from '../../interfaces/book-author.repository.interface';
import { CreateBookAuthorDto, UpdateBookAuthorDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto';

describe('BookAuthorService', () => {
    let service: BookAuthorService;
    let repository: IBookAuthorRepository;

    const mockBookAuthorRepository = {
        registerAuthor: jest.fn(),
        getAllAuthors: jest.fn(),
        getAuthorProfile: jest.fn(),
        updateAuthorProfile: jest.fn(),
        deactivateAuthor: jest.fn(),
        searchAuthors: jest.fn(),
        validateUniqueAuthorName: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookAuthorService,
                {
                    provide: 'IBookAuthorRepository',
                    useValue: mockBookAuthorRepository,
                },
            ],
        }).compile();

        service = module.get<BookAuthorService>(BookAuthorService);
        repository = module.get<IBookAuthorRepository>('IBookAuthorRepository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a book author', async () => {
            const createDto = new CreateBookAuthorDto();
            await service.create(createDto, '1');
            expect(repository.registerAuthor).toHaveBeenCalledWith(createDto, '1');
        });
    });

    describe('findAll', () => {
        it('should find all book authors', async () => {
            const pagination = new PaginationDto();
            await service.findAll(pagination);
            expect(repository.getAllAuthors).toHaveBeenCalledWith(pagination);
        });
    });

    describe('findById', () => {
        it('should find a book author by id', async () => {
            await service.findById('1');
            expect(repository.getAuthorProfile).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a book author', async () => {
            const updateDto = new UpdateBookAuthorDto();
            await service.update('1', updateDto, '1');
            expect(repository.updateAuthorProfile).toHaveBeenCalledWith('1', updateDto, '1');
        });
    });

    describe('softDelete', () => {
        it('should soft delete a book author', async () => {
            await service.softDelete('1', '1');
            expect(repository.deactivateAuthor).toHaveBeenCalledWith('1', '1');
        });
    });

    describe('search', () => {
        it('should search book authors', async () => {
            const pagination = new PaginationDto();
            await service.search('test', pagination);
            expect(repository.searchAuthors).toHaveBeenCalledWith('test', pagination);
        });
    });

    describe('findByFullName', () => {
        it('should find a book author by full name', async () => {
            await service.findByFullName('John', 'Doe');
            expect(repository.validateUniqueAuthorName).toHaveBeenCalledWith('John', 'Doe');
        });
    });
});
