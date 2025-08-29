import { Test, TestingModule } from '@nestjs/testing';
import { BookGenreSearchService } from '../book-genre-search.service';
import { IBookGenreSearchRepository } from '../../interfaces/book-genre-search.repository.interface';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { BookGenre } from '../../entities/book-genre.entity';

describe('BookGenreSearchService', () => {
  let service: BookGenreSearchService;
  let searchRepository: IBookGenreSearchRepository;

  const mockBookGenre: BookGenre = {
    id: '1',
    name: 'Fantasy',
    description: 'Fantasy genre books',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as BookGenre;

  const mockSearchRepository = {
    searchGenres: jest.fn(),
    checkNameExists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookGenreSearchService,
        { provide: 'IBookGenreSearchRepository', useValue: mockSearchRepository },
      ],
    }).compile();

    service = module.get<BookGenreSearchService>(BookGenreSearchService);
    searchRepository = module.get<IBookGenreSearchRepository>('IBookGenreSearchRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should search genres by term', async () => {
      const searchTerm = 'fantasy';
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookGenre], meta: { total: 1, page: 1, limit: 10 } };
      mockSearchRepository.searchGenres.mockResolvedValue(paginatedResult);

      const result = await service.search(searchTerm, pagination);

      expect(searchRepository.searchGenres).toHaveBeenCalledWith(searchTerm, pagination);
      expect(result).toEqual(paginatedResult);
    });
  });
});