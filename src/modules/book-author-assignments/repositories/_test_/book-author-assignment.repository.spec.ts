import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookAuthorAssignmentRepository } from '../book-author-assignment.repository';
import { BookAuthorAssignment } from '../../entities/book-author-assignment.entity';
import { CreateBookAuthorAssignmentDto, UpdateBookAuthorAssignmentDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto';
import { ConflictException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

const mockBookAuthorAssignment: BookAuthorAssignment = {
    id: '1',
    bookId: '1',
    authorId: '1',
    createdAt: new Date(),
    book: null,
    author: null,
};

describe('BookAuthorAssignmentRepository', () => {
    let repository: BookAuthorAssignmentRepository;
    let assignmentRepo: Repository<BookAuthorAssignment>;

    const mockAssignmentRepo = {
        findOne: jest.fn(),
        create: jest.fn().mockReturnValue(mockBookAuthorAssignment),
        save: jest.fn().mockResolvedValue(mockBookAuthorAssignment),
        softDelete: jest.fn(),
        update: jest.fn(),
        findAndCount: jest.fn(),
        count: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookAuthorAssignmentRepository,
                {
                    provide: getRepositoryToken(BookAuthorAssignment),
                    useValue: mockAssignmentRepo,
                },
                {
                    provide: 'IAuditLogService',
                    useValue: {},
                }
            ],
        }).compile();

        repository = module.get<BookAuthorAssignmentRepository>(BookAuthorAssignmentRepository);
        assignmentRepo = module.get<Repository<BookAuthorAssignment>>(getRepositoryToken(BookAuthorAssignment));
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('createAssignment', () => {
        it('should create an assignment', async () => {
            (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
            (repository as any)._createEntity = jest.fn().mockResolvedValue(mockBookAuthorAssignment);
            const createDto = new CreateBookAuthorAssignmentDto();
            const result = await repository.createAssignment(createDto);
            expect(result).toEqual(mockBookAuthorAssignment);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._validateUniqueConstraints = jest.fn().mockRejectedValue(new Error());
            const createDto = new CreateBookAuthorAssignmentDto();
            await expect(repository.createAssignment(createDto)).rejects.toThrow(HttpException);
        });
    });

    describe('getAssignmentProfile', () => {
        it('should return an assignment profile', async () => {
            (repository as any)._findOne = jest.fn().mockResolvedValue(mockBookAuthorAssignment);
            const result = await repository.getAssignmentProfile('1');
            expect(result).toEqual(mockBookAuthorAssignment);
        });

        it('should throw not found exception if assignment does not exist', async () => {
            (repository as any)._findOne = jest.fn().mockResolvedValue(null);
            await expect(repository.getAssignmentProfile('1')).rejects.toThrow(NotFoundException);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._findOne = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAssignmentProfile('1')).rejects.toThrow(HttpException);
        });
    });

    describe('updateAssignment', () => {
        it('should update an assignment', async () => {
            const updateDto = new UpdateBookAuthorAssignmentDto();
            (repository as any).getAssignmentProfile = jest.fn().mockResolvedValue(mockBookAuthorAssignment);
            (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
            (repository as any)._updateEntity = jest.fn();
            (repository as any).getAssignmentProfile = jest.fn().mockResolvedValue({ ...mockBookAuthorAssignment, ...updateDto });

            const result = await repository.updateAssignment('1', updateDto);
            expect(result).toBeDefined();
        });

        it('should throw http exception on error', async () => {
            const updateDto = new UpdateBookAuthorAssignmentDto();
            (repository as any).getAssignmentProfile = jest.fn().mockRejectedValue(new Error());
            await expect(repository.updateAssignment('1', updateDto)).rejects.toThrow(HttpException);
        });
    });

    describe('deactivateAssignment', () => {
        it('should deactivate an assignment', async () => {
            (repository as any).getAssignmentProfile = jest.fn().mockResolvedValue(mockBookAuthorAssignment);
            (repository as any)._softDelete = jest.fn();
            await repository.deactivateAssignment('1');
            expect((repository as any)._softDelete).toHaveBeenCalledWith('1');
        });

        it('should throw http exception on error', async () => {
            (repository as any).getAssignmentProfile = jest.fn().mockRejectedValue(new Error());
            await expect(repository.deactivateAssignment('1')).rejects.toThrow(HttpException);
        });
    });

    describe('getAllAssignments', () => {
        it('should get all assignments', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getAllAssignments(pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAllAssignments(pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getAssignmentsByBook', () => {
        it('should get assignments by book', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getAssignmentsByBook('1', pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAssignmentsByBook('1', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getAssignmentsByAuthor', () => {
        it('should get assignments by author', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getAssignmentsByAuthor('1', pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAssignmentsByAuthor('1', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('checkAssignmentExists', () => {
        it('should check if assignment exists', async () => {
            (repository as any)._exists = jest.fn().mockResolvedValue(true);
            const result = await repository.checkAssignmentExists('1', '1');
            expect(result).toBe(true);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._exists = jest.fn().mockRejectedValue(new Error());
            await expect(repository.checkAssignmentExists('1', '1')).rejects.toThrow(HttpException);
        });
    });
});
