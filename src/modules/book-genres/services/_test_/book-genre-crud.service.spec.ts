import { Test, TestingModule } from '@nestjs/testing';
import { BookGenreCrudService } from '../book-genre-crud.service';
import { IBookGenreCrudRepository } from '../../interfaces/book-genre-crud.repository.interface';
import { CreateBookGenreDto } from '../../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../../dto/update-book-genre.dto';
import { BookGenre } from '../../entities/book-genre.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

describe('BookGenreCrudService', () => {
  let service: BookGenreCrudService;
  let mockCrudRepository: jest.Mocked<IBookGenreCrudRepository>;

  const mockGenre: BookGenre = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Science Fiction',
    description: 'Fiction that deals with futuristic concepts',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockGenres: BookGenre[] = [
    mockGenre,
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Fantasy',
      description: 'Literature set in an imaginary universe',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  const mockPaginatedResult = {
    data: mockGenres,
    meta: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };

  const createDto: CreateBookGenreDto = {
    name: 'Science Fiction',
    description: 'Fiction that deals with futuristic concepts',
  };

  const updateDto: UpdateBookGenreDto = {
    description: 'Updated description',
  };

  const createPagination = (): PaginationDto => {
    const paginationDto = new PaginationDto();
    paginationDto.page = 1;
    paginationDto.limit = 10;
    paginationDto.sortBy = 'createdAt';
    paginationDto.sortOrder = 'DESC';
    return paginationDto;
  };
  const pagination = createPagination();

  beforeEach(async () => {
    mockCrudRepository = {
      registerGenre: jest.fn(),
      getAllGenres: jest.fn(),
      getGenreProfile: jest.fn(),
      updateGenreProfile: jest.fn(),
      deactivateGenre: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookGenreCrudService,
        {
          provide: 'IBookGenreCrudRepository',
          useValue: mockCrudRepository,
        },
      ],
    }).compile();

    service = module.get<BookGenreCrudService>(BookGenreCrudService);
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('create()', () => {
    it('should create a new genre successfully', async () => {
      mockCrudRepository.registerGenre.mockResolvedValue(mockGenre);

      const result = await service.create(createDto, 'user123');

      expect(result).toEqual(mockGenre);
      expect(mockCrudRepository.registerGenre).toHaveBeenCalledWith(createDto, 'user123');
    });

    it('should handle repository errors during creation', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.registerGenre.mockRejectedValue(repositoryError);

      await expect(service.create(createDto, 'user123')).rejects.toThrow('Database error');
    });
  });

  describe('findAll()', () => {
    it('should return paginated genres list', async () => {
      mockCrudRepository.getAllGenres.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(pagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockCrudRepository.getAllGenres).toHaveBeenCalledWith(pagination);
    });

    it('should handle empty results', async () => {
      const emptyResult = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
      mockCrudRepository.getAllGenres.mockResolvedValue(emptyResult);

      const result = await service.findAll(pagination);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database connection error');
      mockCrudRepository.getAllGenres.mockRejectedValue(repositoryError);

      await expect(service.findAll(pagination)).rejects.toThrow('Database connection error');
    });
  });

  describe('findById()', () => {
    it('should return a genre by ID', async () => {
      mockCrudRepository.getGenreProfile.mockResolvedValue(mockGenre);

      const result = await service.findById(mockGenre.id);

      expect(result).toEqual(mockGenre);
      expect(mockCrudRepository.getGenreProfile).toHaveBeenCalledWith(mockGenre.id);
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.getGenreProfile.mockRejectedValue(repositoryError);

      await expect(service.findById(mockGenre.id)).rejects.toThrow('Database error');
    });
  });

  describe('update()', () => {
    it('should update a genre successfully', async () => {
      const updatedGenre = { ...mockGenre, ...updateDto };
      mockCrudRepository.updateGenreProfile.mockResolvedValue(updatedGenre);

      const result = await service.update(mockGenre.id, updateDto, 'user123');

      expect(result).toEqual(updatedGenre);
      expect(mockCrudRepository.updateGenreProfile).toHaveBeenCalledWith(
        mockGenre.id,
        updateDto,
        'user123',
      );
    });

    it('should handle repository errors during update', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.updateGenreProfile.mockRejectedValue(repositoryError);

      await expect(service.update(mockGenre.id, updateDto, 'user123')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('softDelete()', () => {
    it('should soft delete a genre successfully', async () => {
      const deleteResult = { id: mockGenre.id };
      mockCrudRepository.deactivateGenre.mockResolvedValue(deleteResult);

      const result = await service.softDelete(mockGenre.id, 'user123');

      expect(result).toEqual(deleteResult);
      expect(mockCrudRepository.deactivateGenre).toHaveBeenCalledWith(mockGenre.id, 'user123');
    });

    it('should handle repository errors during deletion', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.deactivateGenre.mockRejectedValue(repositoryError);

      await expect(service.softDelete(mockGenre.id, 'user123')).rejects.toThrow('Database error');
    });
  });
});
