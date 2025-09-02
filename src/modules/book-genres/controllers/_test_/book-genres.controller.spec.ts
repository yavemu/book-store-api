import { Test, TestingModule } from '@nestjs/testing';
import { BookGenresController } from '../book-genres.controller';
import { IBookGenreCrudService } from '../../interfaces/book-genre-crud.service.interface';
import { IBookGenreSearchService } from '../../interfaces/book-genre-search.service.interface';
import { CreateBookGenreDto } from '../../dto/create-book-genre.dto';
import { UpdateBookGenreDto } from '../../dto/update-book-genre.dto';
import {
  BookGenreFiltersDto,
  BookGenreExactSearchDto,
  BookGenreSimpleFilterDto,
  BookGenreCsvExportFiltersDto,
} from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { PaginationInputDto } from '../../../../common/dto/pagination-input.dto';
import { BookGenre } from '../../entities/book-genre.entity';
import { Response } from 'express';

describe('BookGenresController', () => {
  let controller: BookGenresController;
  let mockCrudService: jest.Mocked<IBookGenreCrudService>;
  let mockSearchService: jest.Mocked<IBookGenreSearchService>;

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

  const mockRequest = {
    user: { userId: 'user123' },
  };

  beforeEach(async () => {
    mockCrudService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    mockSearchService = {
      exactSearch: jest.fn(),
      simpleFilter: jest.fn(),
      findWithFilters: jest.fn(),
      exportToCsv: jest.fn(),
      search: jest.fn(),
      filterSearch: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookGenresController],
      providers: [
        {
          provide: 'IBookGenreCrudService',
          useValue: mockCrudService,
        },
        {
          provide: 'IBookGenreSearchService',
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<BookGenresController>(BookGenresController);
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('create()', () => {
    it('should create a new genre successfully', async () => {
      mockCrudService.create.mockResolvedValue(mockGenre);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(mockGenre);
      expect(mockCrudService.create).toHaveBeenCalledWith(createDto, mockRequest.user.userId);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      mockCrudService.create.mockRejectedValue(error);

      await expect(controller.create(createDto, mockRequest)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll()', () => {
    it('should return paginated genres list', async () => {
      mockCrudService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(pagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockCrudService.findAll).toHaveBeenCalledWith(pagination);
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
      mockCrudService.findAll.mockResolvedValue(emptyResult);

      const result = await controller.findAll(pagination);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });
  });

  describe('findOne()', () => {
    it('should return a genre by ID', async () => {
      mockCrudService.findById.mockResolvedValue(mockGenre);

      const result = await controller.findOne(mockGenre.id);

      expect(result).toEqual(mockGenre);
      expect(mockCrudService.findById).toHaveBeenCalledWith(mockGenre.id);
    });

    it('should handle genre not found', async () => {
      const error = new Error('Genre not found');
      mockCrudService.findById.mockRejectedValue(error);

      await expect(controller.findOne('non-existent-id')).rejects.toThrow('Genre not found');
    });
  });

  describe('update()', () => {
    it('should update a genre successfully', async () => {
      const updatedGenre = { ...mockGenre, ...updateDto };
      mockCrudService.update.mockResolvedValue(updatedGenre);

      const result = await controller.update(mockGenre.id, updateDto, mockRequest);

      expect(result).toEqual(updatedGenre);
      expect(mockCrudService.update).toHaveBeenCalledWith(
        mockGenre.id,
        updateDto,
        mockRequest.user.userId,
      );
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockCrudService.update.mockRejectedValue(error);

      await expect(controller.update(mockGenre.id, updateDto, mockRequest)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('softDelete()', () => {
    it('should soft delete a genre successfully', async () => {
      mockCrudService.softDelete.mockResolvedValue(undefined);

      const result = await controller.softDelete(mockGenre.id, mockRequest);

      expect(result).toBeUndefined();
      expect(mockCrudService.softDelete).toHaveBeenCalledWith(
        mockGenre.id,
        mockRequest.user.userId,
      );
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Deletion failed');
      mockCrudService.softDelete.mockRejectedValue(error);

      await expect(controller.softDelete(mockGenre.id, mockRequest)).rejects.toThrow(
        'Deletion failed',
      );
    });
  });

  describe('exactSearch()', () => {
    it('should perform exact search successfully', async () => {
      const searchDto = new BookGenreExactSearchDto();
      searchDto.searchField = 'name';
      searchDto.searchValue = 'Science Fiction';
      searchDto.page = 1;
      searchDto.limit = 10;
      mockSearchService.exactSearch.mockResolvedValue(mockPaginatedResult);

      const pagination = new PaginationInputDto();
      pagination.page = 1;
      pagination.limit = 10;
      const result = await controller.exactSearch(searchDto, pagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockSearchService.exactSearch).toHaveBeenCalledWith(searchDto);
    });

    it('should return empty results for no matches', async () => {
      const searchDto = new BookGenreExactSearchDto();
      searchDto.searchField = 'name';
      searchDto.searchValue = 'NonExistent';
      searchDto.page = 1;
      searchDto.limit = 10;
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
      mockSearchService.exactSearch.mockResolvedValue(emptyResult);

      const pagination = new PaginationInputDto();
      pagination.page = 1;
      pagination.limit = 10;
      const result = await controller.exactSearch(searchDto, pagination);

      expect(result.data).toHaveLength(0);
    });
  });

  describe('simpleFilter()', () => {
    it('should perform simple filter successfully', async () => {
      const filterDto = new BookGenreSimpleFilterDto();
      filterDto.term = 'Fiction';
      filterDto.page = 1;
      filterDto.limit = 10;
      mockSearchService.simpleFilter.mockResolvedValue(mockPaginatedResult);

      const pagination = new PaginationDto();
      pagination.page = filterDto.page;
      pagination.limit = filterDto.limit;
      pagination.sortBy = 'createdAt';
      pagination.sortOrder = 'DESC';
      const result = await controller.simpleFilter(filterDto.term, pagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockSearchService.simpleFilter).toHaveBeenCalledWith(filterDto.term, pagination);
    });
  });

  describe('advancedFilter()', () => {
    it('should perform advanced filter successfully', async () => {
      const filtersDto: BookGenreFiltersDto = {
        name: 'Science Fiction',
        description: 'futuristic',
      };
      mockSearchService.findWithFilters.mockResolvedValue(mockPaginatedResult);

      const result = await controller.advancedFilter(filtersDto, pagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockSearchService.findWithFilters).toHaveBeenCalledWith(filtersDto, pagination);
    });
  });

  describe('exportToCsv()', () => {
    it('should export genres to CSV successfully', async () => {
      const csvFilters: BookGenreCsvExportFiltersDto = {
        name: 'Fiction',
      };
      const mockCsvData =
        'Name,Description\nScience Fiction,Fiction that deals with futuristic concepts';
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      mockSearchService.exportToCsv.mockResolvedValue(mockCsvData);

      await controller.exportToCsv(csvFilters, mockResponse);

      expect(mockSearchService.exportToCsv).toHaveBeenCalledWith(csvFilters);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        expect.stringContaining('attachment; filename="book_genres_'),
      );
      expect(mockResponse.send).toHaveBeenCalledWith(mockCsvData);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle concurrent operations gracefully', async () => {
      mockCrudService.findAll.mockResolvedValue(mockPaginatedResult);
      mockCrudService.findById.mockResolvedValue(mockGenre);

      const promises = [
        controller.findAll(pagination),
        controller.findOne(mockGenre.id),
        controller.findAll(createPagination()),
      ];
      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(mockCrudService.findAll).toHaveBeenCalledTimes(2);
      expect(mockCrudService.findById).toHaveBeenCalledTimes(1);
    });

    it('should maintain data consistency across operations', async () => {
      const originalGenre = { ...mockGenre };
      const updatedGenre = { ...mockGenre, description: 'Updated description' };

      mockCrudService.create.mockResolvedValue(originalGenre);
      mockCrudService.update.mockResolvedValue(updatedGenre);
      mockCrudService.findById.mockResolvedValue(updatedGenre);

      const createdGenre = await controller.create(createDto, mockRequest);
      const modifiedGenre = await controller.update(createdGenre.id, updateDto, mockRequest);
      const retrievedGenre = await controller.findOne(createdGenre.id);

      expect(createdGenre.id).toBe(originalGenre.id);
      expect(modifiedGenre.id).toBe(originalGenre.id);
      expect(retrievedGenre.id).toBe(originalGenre.id);
    });
  });
});
