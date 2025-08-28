import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookGenreRepository } from '../book-genre.repository';
import { BookGenre } from '../../entities/book-genre.entity';
import { CreateBookGenreDto, UpdateBookGenreDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto';
import { ConflictException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

const mockBookGenre: BookGenre = {
    id: '1',
    name: 'test',
    description: 'test genre',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
};

describe('BookGenreRepository', () => {
    let repository: BookGenreRepository;
    let genreRepo: Repository<BookGenre>;

    const mockGenreRepo = {
        findOne: jest.fn(),
        create: jest.fn().mockReturnValue(mockBookGenre),
        save: jest.fn().mockResolvedValue(mockBookGenre),
        softDelete: jest.fn(),
        update: jest.fn(),
        findAndCount: jest.fn(),
        count: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookGenreRepository,
                {
                    provide: getRepositoryToken(BookGenre),
                    useValue: mockGenreRepo,
                },
                {
                    provide: 'IAuditLogService',
                    useValue: {},
                }
            ],
        }).compile();

        repository = module.get<BookGenreRepository>(BookGenreRepository);
        genreRepo = module.get<Repository<BookGenre>>(getRepositoryToken(BookGenre));
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('registerGenre', () => {
        it('should register a genre', async () => {
            (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
            (repository as any)._createEntity = jest.fn().mockResolvedValue(mockBookGenre);
            const createDto = new CreateBookGenreDto();
            const result = await repository.registerGenre(createDto);
            expect(result).toEqual(mockBookGenre);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._validateUniqueConstraints = jest.fn().mockRejectedValue(new Error());
            const createDto = new CreateBookGenreDto();
            await expect(repository.registerGenre(createDto)).rejects.toThrow(HttpException);
        });
    });

    describe('getGenreProfile', () => {
        it('should return a genre profile', async () => {
            (repository as any)._findById = jest.fn().mockResolvedValue(mockBookGenre);
            const result = await repository.getGenreProfile('1');
            expect(result).toEqual(mockBookGenre);
        });

        it('should throw not found exception if genre does not exist', async () => {
            (repository as any)._findById = jest.fn().mockResolvedValue(null);
            await expect(repository.getGenreProfile('1')).rejects.toThrow(NotFoundException);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._findById = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getGenreProfile('1')).rejects.toThrow(HttpException);
        });
    });

    describe('updateGenreProfile', () => {
        it('should update a genre profile', async () => {
            const updateDto = new UpdateBookGenreDto();
            (repository as any).getGenreProfile = jest.fn().mockResolvedValue(mockBookGenre);
            (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
            (repository as any)._updateEntity = jest.fn();
            (repository as any)._findById = jest.fn().mockResolvedValue({ ...mockBookGenre, ...updateDto });

            const result = await repository.updateGenreProfile('1', updateDto);
            expect(result).toBeDefined();
        });

        it('should throw http exception on error', async () => {
            const updateDto = new UpdateBookGenreDto();
            (repository as any).getGenreProfile = jest.fn().mockRejectedValue(new Error());
            await expect(repository.updateGenreProfile('1', updateDto)).rejects.toThrow(HttpException);
        });
    });

    describe('deactivateGenre', () => {
        it('should deactivate a genre', async () => {
            (repository as any).getGenreProfile = jest.fn().mockResolvedValue(mockBookGenre);
            (repository as any)._softDelete = jest.fn();
            await repository.deactivateGenre('1');
            expect((repository as any)._softDelete).toHaveBeenCalledWith('1');
        });

        it('should throw http exception on error', async () => {
            (repository as any).getGenreProfile = jest.fn().mockRejectedValue(new Error());
            await expect(repository.deactivateGenre('1')).rejects.toThrow(HttpException);
        });
    });

    describe('searchGenres', () => {
        it('should search genres', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.searchGenres('test', pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.searchGenres('test', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getAllGenres', () => {
        it('should get all genres', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getAllGenres(pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAllGenres(pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('checknameExists', () => {
        it('should check if name exists', async () => {
            (repository as any)._exists = jest.fn().mockResolvedValue(true);
            const result = await repository.checknameExists('test');
            expect(result).toBe(true);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._exists = jest.fn().mockRejectedValue(new Error());
            await expect(repository.checknameExists('test')).rejects.toThrow(HttpException);
        });
    });
});
