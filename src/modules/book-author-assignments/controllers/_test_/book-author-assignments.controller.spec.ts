import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorAssignmentsController } from '../../book-author-assignments.controller';
import { IBookAuthorAssignmentService } from '../../interfaces/book-author-assignment.service.interface';
import { IBookAuthorAssignmentSearchService } from '../../interfaces/book-author-assignment-search.service.interface';
import { CreateBookAuthorAssignmentDto } from '../../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../../dto/update-book-author-assignment.dto';
import {
  AssignmentFiltersDto,
  AssignmentExactSearchDto,
  AssignmentSimpleFilterDto,
  AssignmentCsvExportFiltersDto,
} from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { BookAuthorAssignment } from '../../entities/book-author-assignment.entity';
import { Response } from 'express';

describe('BookAuthorAssignmentsController', () => {
  let controller: BookAuthorAssignmentsController;
  let mockCrudService: jest.Mocked<IBookAuthorAssignmentService>;
  let mockSearchService: jest.Mocked<IBookAuthorAssignmentSearchService>;

  const mockAssignment: BookAuthorAssignment = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    bookId: 'book-123',
    authorId: 'author-123',
    book: {} as any,
    author: {} as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAssignments: BookAuthorAssignment[] = [
    mockAssignment,
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      bookId: 'book-456',
      authorId: 'author-456',
      book: {} as any,
      author: {} as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockPaginatedResult = {
    data: mockAssignments,
    meta: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };

  const createDto: CreateBookAuthorAssignmentDto = {
    bookId: 'book-123',
    authorId: 'author-123',
    authorRole: 'Main Author',
  };

  const updateDto: UpdateBookAuthorAssignmentDto = {
    authorRole: 'Co-Author',
  };

  const pagination: PaginationDto = {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
    offset: 0,
  };

  const mockRequest = {
    user: {
      id: 'user123',
      userId: 'user123',
    },
  };

  beforeEach(async () => {
    mockCrudService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      findByBook: jest.fn(),
      findByAuthor: jest.fn(),
      checkAssignmentExists: jest.fn(),
    };

    mockSearchService = {
      exactSearch: jest.fn(),
      simpleFilter: jest.fn(),
      advancedFilter: jest.fn(),
      exportToCsv: jest.fn(),
      findByBook: jest.fn(),
      findByAuthor: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookAuthorAssignmentsController],
      providers: [
        {
          provide: 'IBookAuthorAssignmentService',
          useValue: mockCrudService,
        },
        {
          provide: 'IBookAuthorAssignmentSearchService',
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<BookAuthorAssignmentsController>(BookAuthorAssignmentsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new assignment', async () => {
      mockCrudService.create.mockResolvedValue(mockAssignment);

      const result = await controller.create(createDto, mockRequest);

      expect(result).toEqual(mockAssignment);
      expect(mockCrudService.create).toHaveBeenCalledWith(createDto, 'user123');
    });

    it('should handle creation errors', async () => {
      const error = new Error('Creation failed');
      mockCrudService.create.mockRejectedValue(error);

      await expect(controller.create(createDto, mockRequest)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll()', () => {
    it('should return all assignments with pagination', async () => {
      mockCrudService.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await controller.findAll(pagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockCrudService.findAll).toHaveBeenCalledWith(pagination);
    });

    it('should handle findAll errors', async () => {
      const error = new Error('Find all failed');
      mockCrudService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(pagination)).rejects.toThrow('Find all failed');
    });
  });

  describe('findOne()', () => {
    it('should return a specific assignment', async () => {
      mockCrudService.findById.mockResolvedValue(mockAssignment);

      const result = await controller.findOne(mockAssignment.id);

      expect(result).toEqual(mockAssignment);
      expect(mockCrudService.findById).toHaveBeenCalledWith(mockAssignment.id);
    });

    it('should handle assignment not found', async () => {
      const error = new Error('Assignment not found');
      mockCrudService.findById.mockRejectedValue(error);

      await expect(controller.findOne('non-existent-id')).rejects.toThrow(
        'Assignment not found',
      );
    });
  });

  describe('update()', () => {
    it('should update an assignment', async () => {
      const updatedAssignment = { ...mockAssignment, ...updateDto };
      mockCrudService.update.mockResolvedValue(updatedAssignment);

      const result = await controller.update(mockAssignment.id, updateDto, mockRequest);

      expect(result).toEqual(updatedAssignment);
      expect(mockCrudService.update).toHaveBeenCalledWith(
        mockAssignment.id,
        updateDto,
        'user123',
      );
    });

    it('should handle update errors', async () => {
      const error = new Error('Update failed');
      mockCrudService.update.mockRejectedValue(error);

      await expect(
        controller.update(mockAssignment.id, updateDto, mockRequest),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('remove()', () => {
    it('should soft delete an assignment', async () => {
      mockCrudService.softDelete.mockResolvedValue(undefined);

      const result = await controller.remove(mockAssignment.id, mockRequest);

      expect(result).toBeUndefined();
      expect(mockCrudService.softDelete).toHaveBeenCalledWith(mockAssignment.id, 'user123');
    });

    it('should handle deletion errors', async () => {
      const error = new Error('Deletion failed');
      mockCrudService.softDelete.mockRejectedValue(error);

      await expect(controller.remove(mockAssignment.id, mockRequest)).rejects.toThrow(
        'Deletion failed',
      );
    });
  });

  describe('exactSearch()', () => {
    it('should perform exact search', async () => {
      const searchDto = new AssignmentExactSearchDto();
      searchDto.searchField = 'bookId';
      searchDto.searchValue = 'book-123';

      mockSearchService.exactSearch.mockResolvedValue(mockPaginatedResult);

      const result = await controller.exactSearch(searchDto);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockSearchService.exactSearch).toHaveBeenCalledWith(searchDto);
    });

    it('should handle search errors', async () => {
      const searchDto = new AssignmentExactSearchDto();
      const error = new Error('Search failed');
      mockSearchService.exactSearch.mockRejectedValue(error);

      await expect(controller.exactSearch(searchDto)).rejects.toThrow('Search failed');
    });
  });

  describe('simpleFilter()', () => {
    it('should perform simple filter', async () => {
      const filterDto = new AssignmentSimpleFilterDto();
      filterDto.term = 'book-123';

      mockSearchService.simpleFilter.mockResolvedValue(mockPaginatedResult);

      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      pagination.sortBy = 'createdAt';
      pagination.sortOrder = 'DESC';
      const dto = Object.assign({}, filterDto, pagination);
      const result = await controller.simpleFilter(dto);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockSearchService.simpleFilter).toHaveBeenCalledWith(filterDto.term, pagination);
    });

    it('should handle filter errors', async () => {
      const filterDto = new AssignmentSimpleFilterDto();
      const error = new Error('Filter failed');
      mockSearchService.simpleFilter.mockRejectedValue(error);

      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      pagination.sortBy = 'createdAt';
      pagination.sortOrder = 'DESC';
      const dto = Object.assign({}, filterDto, pagination);
      await expect(controller.simpleFilter(dto)).rejects.toThrow('Filter failed');
    });
  });

  describe('advancedFilter()', () => {
    it('should perform advanced filter', async () => {
      const filters: AssignmentFiltersDto = {
        bookId: 'book-123',
      };

      mockSearchService.advancedFilter.mockResolvedValue(mockPaginatedResult);

      const result = await controller.advancedFilter(filters, pagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockSearchService.advancedFilter).toHaveBeenCalledWith(filters, pagination);
    });

    it('should handle advanced filter errors', async () => {
      const filters: AssignmentFiltersDto = {};
      const error = new Error('Advanced filter failed');
      mockSearchService.advancedFilter.mockRejectedValue(error);

      await expect(controller.advancedFilter(filters, pagination)).rejects.toThrow(
        'Advanced filter failed',
      );
    });
  });

  describe('exportToCsv()', () => {
    it('should export assignments to CSV', async () => {
      const csvFilters: AssignmentCsvExportFiltersDto = {
        bookId: 'book-123',
      };
      const mockCsvData = 'ID,BookID,AuthorID,Order\nassignment-1,book-123,author-123,1';
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
        expect.stringContaining('attachment; filename="book_author_assignments_'),
      );
      expect(mockResponse.send).toHaveBeenCalledWith(mockCsvData);
    });

    it('should handle CSV export errors', async () => {
      const csvFilters: AssignmentCsvExportFiltersDto = {};
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;
      const error = new Error('CSV export failed');
      mockSearchService.exportToCsv.mockRejectedValue(error);

      await expect(controller.exportToCsv(csvFilters, mockResponse)).rejects.toThrow(
        'CSV export failed',
      );
    });
  });

  describe('Legacy Methods', () => {
    describe('search()', () => {
      it('should call exactSearch method', async () => {
        const searchDto = { searchField: 'bookId', searchValue: 'book-123' };
        mockSearchService.exactSearch.mockResolvedValue(mockPaginatedResult);

        // Mock the exactSearch method directly on the controller
        const spy = jest.spyOn(controller, 'exactSearch').mockResolvedValue(mockPaginatedResult);

        const result = await controller.search(searchDto, pagination);

        expect(result).toEqual(mockPaginatedResult);
        expect(spy).toHaveBeenCalledWith(searchDto);
      });
    });

    describe('filter()', () => {
      it('should call simpleFilter method', async () => {
        const filters = { term: 'book-123' };
        mockSearchService.simpleFilter.mockResolvedValue(mockPaginatedResult);

        const spy = jest.spyOn(controller, 'simpleFilter').mockResolvedValue(mockPaginatedResult);

        const result = await controller.filter(filters, pagination);

        expect(result).toEqual(mockPaginatedResult);
        expect(spy).toHaveBeenCalledWith(filters);
      });
    });

    describe('checkAssignment()', () => {
      it('should return not implemented message', async () => {
        const result = await controller.checkAssignment('book-123', 'author-123');

        expect(result).toEqual({
          exists: false,
          message: 'Method not implemented yet',
        });
      });
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle concurrent operations gracefully', async () => {
      mockCrudService.findAll.mockResolvedValue(mockPaginatedResult);
      mockCrudService.findById.mockResolvedValue(mockAssignment);
      mockCrudService.create.mockResolvedValue(mockAssignment);

      const promises = [
        controller.findAll(pagination),
        controller.findOne(mockAssignment.id),
        controller.create(createDto, mockRequest),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(mockCrudService.findAll).toHaveBeenCalledTimes(1);
      expect(mockCrudService.findById).toHaveBeenCalledTimes(1);
      expect(mockCrudService.create).toHaveBeenCalledTimes(1);
    });

    it('should maintain data consistency across operations', async () => {
      const originalAssignment = { ...mockAssignment };
      const updatedAssignment = { ...mockAssignment, ...updateDto };

      mockCrudService.create.mockResolvedValue(originalAssignment);
      mockCrudService.update.mockResolvedValue(updatedAssignment);
      mockCrudService.findById.mockResolvedValue(updatedAssignment);

      const createdAssignment = await controller.create(createDto, mockRequest);
      const modifiedAssignment = await controller.update(
        createdAssignment.id,
        updateDto,
        mockRequest,
      );
      const retrievedAssignment = await controller.findOne(createdAssignment.id);

      expect(createdAssignment.id).toBe(originalAssignment.id);
      expect(modifiedAssignment.id).toBe(originalAssignment.id);
      expect(retrievedAssignment.id).toBe(originalAssignment.id);
    });
  });
});