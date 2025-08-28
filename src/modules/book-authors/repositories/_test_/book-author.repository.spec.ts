import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookAuthorRepository } from '../book-author.repository';
import { BookAuthor } from '../../entities/book-author.entity';
import { CreateBookAuthorDto, UpdateBookAuthorDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto';
import { ConflictException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

const mockBookAuthor: BookAuthor = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    birthDate: new Date(),
    nationality: 'USA',
    biography: 'A biography',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
};

describe('BookAuthorRepository', () => {
    let repository: BookAuthorRepository;
    let authorRepo: Repository<BookAuthor>;

    const mockAuthorRepo = {
        findOne: jest.fn(),
        create: jest.fn().mockReturnValue(mockBookAuthor),
        save: jest.fn().mockResolvedValue(mockBookAuthor),
        softDelete: jest.fn(),
        update: jest.fn(),
        findAndCount: jest.fn(),
        count: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookAuthorRepository,
                {
                    provide: getRepositoryToken(BookAuthor),
                    useValue: mockAuthorRepo,
                },
                {
                    provide: 'IAuditLogService',
                    useValue: {},
                }
            ],
        }).compile();

        repository = module.get<BookAuthorRepository>(BookAuthorRepository);
        authorRepo = module.get<Repository<BookAuthor>>(getRepositoryToken(BookAuthor));
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('registerAuthor', () => {
        it('should register an author', async () => {
            (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
            (repository as any)._createEntity = jest.fn().mockResolvedValue(mockBookAuthor);
            const createDto = new CreateBookAuthorDto();
            const result = await repository.registerAuthor(createDto);
            expect(result).toEqual(mockBookAuthor);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._validateUniqueConstraints = jest.fn().mockRejectedValue(new Error());
            const createDto = new CreateBookAuthorDto();
            await expect(repository.registerAuthor(createDto)).rejects.toThrow(HttpException);
        });
    });

    describe('getAuthorProfile', () => {
        it('should return an author profile', async () => {
            (repository as any)._findById = jest.fn().mockResolvedValue(mockBookAuthor);
            const result = await repository.getAuthorProfile('1');
            expect(result).toEqual(mockBookAuthor);
        });

        it('should throw not found exception if author does not exist', async () => {
            (repository as any)._findById = jest.fn().mockResolvedValue(null);
            await expect(repository.getAuthorProfile('1')).rejects.toThrow(NotFoundException);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._findById = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAuthorProfile('1')).rejects.toThrow(HttpException);
        });
    });

    describe('updateAuthorProfile', () => {
        it('should update an author profile', async () => {
            const updateDto = new UpdateBookAuthorDto();
            (repository as any).getAuthorProfile = jest.fn().mockResolvedValue(mockBookAuthor);
            (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
            (repository as any)._updateEntity = jest.fn();
            (repository as any)._findById = jest.fn().mockResolvedValue({ ...mockBookAuthor, ...updateDto });

            const result = await repository.updateAuthorProfile('1', updateDto);
            expect(result).toBeDefined();
        });

        it('should throw http exception on error', async () => {
            const updateDto = new UpdateBookAuthorDto();
            (repository as any).getAuthorProfile = jest.fn().mockRejectedValue(new Error());
            await expect(repository.updateAuthorProfile('1', updateDto)).rejects.toThrow(HttpException);
        });
    });

    describe('deactivateAuthor', () => {
        it('should deactivate an author', async () => {
            (repository as any).getAuthorProfile = jest.fn().mockResolvedValue(mockBookAuthor);
            (repository as any)._softDelete = jest.fn();
            await repository.deactivateAuthor('1');
            expect((repository as any)._softDelete).toHaveBeenCalledWith('1');
        });

        it('should throw http exception on error', async () => {
            (repository as any).getAuthorProfile = jest.fn().mockRejectedValue(new Error());
            await expect(repository.deactivateAuthor('1')).rejects.toThrow(HttpException);
        });
    });

    describe('searchAuthors', () => {
        it('should search authors', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.searchAuthors('test', pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.searchAuthors('test', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getAllAuthors', () => {
        it('should get all authors', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getAllAuthors(pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAllAuthors(pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getAuthorsByNationality', () => {
        it('should get authors by nationality', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getAuthorsByNationality('USA', pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAuthorsByNationality('USA', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('checkAuthorFullNameExists', () => {
        it('should check if author full name exists', async () => {
            (repository as any)._exists = jest.fn().mockResolvedValue(true);
            const result = await repository.checkAuthorFullNameExists('John', 'Doe');
            expect(result).toBe(true);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._exists = jest.fn().mockRejectedValue(new Error());
            await expect(repository.checkAuthorFullNameExists('John', 'Doe')).rejects.toThrow(HttpException);
        });
    });

    describe('validateUniqueAuthorName', () => {
        it('should validate unique author name', async () => {
            (repository as any)._findOne = jest.fn().mockResolvedValue(mockBookAuthor);
            const result = await repository.validateUniqueAuthorName('John', 'Doe');
            expect(result).toEqual(mockBookAuthor);
        });

        it('should throw not found exception if author does not exist', async () => {
            (repository as any)._findOne = jest.fn().mockResolvedValue(null);
            await expect(repository.validateUniqueAuthorName('John', 'Doe')).rejects.toThrow(NotFoundException);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._findOne = jest.fn().mockRejectedValue(new Error());
            await expect(repository.validateUniqueAuthorName('John', 'Doe')).rejects.toThrow(HttpException);
        });
    });
});
