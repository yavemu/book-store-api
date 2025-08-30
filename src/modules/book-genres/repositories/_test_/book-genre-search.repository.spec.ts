import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookGenreSearchRepository } from '../book-genre-search.repository';
import { BookGenre } from '../../entities/book-genre.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

const mockBookGenre: BookGenre = {
  id: '1',
  name: 'Fantasy',
  description: 'Fantasy genre books',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as BookGenre;

describe('BookGenreSearchRepository', () => {
  let repository: BookGenreSearchRepository;
  let typeormRepo: Repository<BookGenre>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookGenreSearchRepository,
        {
          provide: getRepositoryToken(BookGenre),
          useValue: {
            count: jest.fn().mockResolvedValue(0),
            createQueryBuilder: jest.fn().mockReturnValue({
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[mockBookGenre], 1]),
            }),
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

    repository = module.get<BookGenreSearchRepository>(BookGenreSearchRepository);
    typeormRepo = module.get<Repository<BookGenre>>(getRepositoryToken(BookGenre));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('searchGenres', () => {
    it('should search genres by term', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookGenre], meta: { total: 1, page: 1, limit: 10 } };

      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.searchGenres('fantasy', pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result.data).toEqual([mockBookGenre]);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('checkNameExists', () => {
    it('should check if name exists and return true', async () => {
      (typeormRepo.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.checkNameExists('Fantasy');

      expect(typeormRepo.count).toHaveBeenCalledWith({
        where: { name: 'Fantasy' },
      });
      expect(result).toBe(true);
    });

    it('should check if name exists and return false', async () => {
      (typeormRepo.count as jest.Mock).mockResolvedValue(0);

      const result = await repository.checkNameExists('NonExistent');

      expect(typeormRepo.count).toHaveBeenCalledWith({
        where: { name: 'NonExistent' },
      });
      expect(result).toBe(false);
    });
  });
});
