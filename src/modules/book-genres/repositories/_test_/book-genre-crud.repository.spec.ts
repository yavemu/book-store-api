import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookGenreCrudRepository } from '../book-genre-crud.repository';
import { BookGenre } from '../../entities/book-genre.entity';
import { CreateBookGenreDto, UpdateBookGenreDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { IAuditLoggerService } from '../../../audit/interfaces/audit-logger.service.interface';

const mockBookGenre: BookGenre = {
  id: '1',
  name: 'Fantasy',
  description: 'Fantasy genre books',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as BookGenre;

describe('BookGenreCrudRepository', () => {
  let repository: BookGenreCrudRepository;
  let typeormRepo: Repository<BookGenre>;
  let auditLoggerService: IAuditLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookGenreCrudRepository,
        {
          provide: getRepositoryToken(BookGenre),
          useValue: {
            create: jest.fn().mockReturnValue(mockBookGenre),
            save: jest.fn().mockResolvedValue(mockBookGenre),
            findOne: jest.fn().mockResolvedValue(mockBookGenre),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
            findAndCount: jest.fn().mockResolvedValue([[mockBookGenre], 1]),
            count: jest.fn().mockResolvedValue(0),
          },
        },
        {
          provide: 'IAuditLoggerService',
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<BookGenreCrudRepository>(BookGenreCrudRepository);
    typeormRepo = module.get<Repository<BookGenre>>(getRepositoryToken(BookGenre));
    auditLoggerService = module.get<IAuditLoggerService>('IAuditLoggerService');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('registerGenre', () => {
    it('should register a genre', async () => {
      const createDto: CreateBookGenreDto = {
        name: 'Fantasy',
        description: 'Fantasy genre books',
      } as CreateBookGenreDto;

      (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
      (repository as any)._create = jest.fn().mockResolvedValue(mockBookGenre);

      const result = await repository.registerGenre(createDto, 'test-user');

      expect((repository as any)._validateUniqueConstraints).toHaveBeenCalled();
      expect((repository as any)._create).toHaveBeenCalled();
      expect(result).toEqual(mockBookGenre);
    });

    it('should throw error if name already exists', async () => {
      const createDto: CreateBookGenreDto = {
        name: 'Fantasy',
        description: 'Fantasy genre books',
      } as CreateBookGenreDto;

      (repository as any)._validateUniqueConstraints = jest
        .fn()
        .mockRejectedValue(new HttpException('Name already exists', HttpStatus.CONFLICT));

      await expect(repository.registerGenre(createDto, 'test-user')).rejects.toThrow(HttpException);
    });
  });

  describe('getGenreProfile', () => {
    it('should return a genre profile', async () => {
      (repository as any)._findById = jest.fn().mockResolvedValue(mockBookGenre);

      const result = await repository.getGenreProfile('1');

      expect((repository as any)._findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBookGenre);
    });
  });

  describe('updateGenreProfile', () => {
    it('should update a genre profile', async () => {
      const updateDto: UpdateBookGenreDto = { name: 'Updated Fantasy' };
      const updatedGenre = { ...mockBookGenre, ...updateDto };

      (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
      (repository as any)._update = jest.fn().mockResolvedValue(updatedGenre);

      const result = await repository.updateGenreProfile('1', updateDto, 'test-user');

      expect((repository as any)._validateUniqueConstraints).toHaveBeenCalled();
      expect((repository as any)._update).toHaveBeenCalled();
      expect(result).toEqual(updatedGenre);
    });
  });

  describe('deactivateGenre', () => {
    it('should deactivate a genre', async () => {
      (repository as any)._softDelete = jest.fn().mockResolvedValue({ id: '1' });

      const result = await repository.deactivateGenre('1', 'test-user');

      expect((repository as any)._softDelete).toHaveBeenCalledWith(
        '1',
        'test-user',
        'BookGenre',
        expect.any(Function),
      );
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('getAllGenres', () => {
    it('should get all genres', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookGenre], meta: { total: 1, page: 1, limit: 10 } };

      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.getAllGenres(pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result).toEqual(paginatedResult);
    });
  });
});
