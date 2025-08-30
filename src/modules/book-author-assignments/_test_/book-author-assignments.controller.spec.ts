import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorAssignmentsController } from '../book-author-assignments.controller';
import { IBookAuthorAssignmentService } from '../interfaces/book-author-assignment.service.interface';
import { IBookAuthorAssignmentSearchService } from '../interfaces/book-author-assignment-search.service.interface';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('BookAuthorAssignmentsController', () => {
  let controller: BookAuthorAssignmentsController;
  let bookAuthorAssignmentService: IBookAuthorAssignmentService;
  let searchService: IBookAuthorAssignmentSearchService;

  const mockBookAuthorAssignmentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    checkAssignmentExists: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockSearchService = {
    findByBook: jest.fn(),
    findByAuthor: jest.fn(),
    searchAssignments: jest.fn(),
    findAssignmentsWithFilters: jest.fn(),
    exportAssignmentsToCsv: jest.fn(),
    checkAssignmentExists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookAuthorAssignmentsController],
      providers: [
        { provide: 'IBookAuthorAssignmentService', useValue: mockBookAuthorAssignmentService },
        { provide: 'IBookAuthorAssignmentSearchService', useValue: mockSearchService },
      ],
    }).compile();

    controller = module.get<BookAuthorAssignmentsController>(BookAuthorAssignmentsController);
    bookAuthorAssignmentService = module.get<IBookAuthorAssignmentService>(
      'IBookAuthorAssignmentService',
    );
    searchService = module.get<IBookAuthorAssignmentSearchService>(
      'IBookAuthorAssignmentSearchService',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book-author assignment', async () => {
      const createDto = new CreateBookAuthorAssignmentDto();
      createDto.bookId = 'book-1';
      createDto.authorId = 'author-1';

      const req = { user: { id: 'user-1' } };
      const mockAssignment = {
        id: 'assignment-1',
        bookId: 'book-1',
        authorId: 'author-1',
        createdBy: 'user-1',
      };

      mockBookAuthorAssignmentService.create.mockResolvedValue(mockAssignment);

      const result = await controller.create(createDto, req);

      expect(bookAuthorAssignmentService.create).toHaveBeenCalledWith(createDto, 'user-1');
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('findAll', () => {
    it('should find all assignments', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      const mockAssignments = {
        data: [
          {
            id: 'assignment-1',
            bookId: 'book-1',
            authorId: 'author-1',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockBookAuthorAssignmentService.findAll.mockResolvedValue(mockAssignments);

      const result = await controller.findAll(pagination);

      expect(bookAuthorAssignmentService.findAll).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(mockAssignments);
    });
  });

  describe('search', () => {
    it('should search assignments by term', async () => {
      const searchTerm = 'test';
      const pagination = new PaginationDto();
      const mockResult = {
        data: [{ id: '1', bookId: '1', authorId: '1' }],
        meta: { total: 1, page: 1, lastPage: 1 },
      };

      mockSearchService.searchAssignments.mockResolvedValue(mockResult);

      const result = await controller.search(searchTerm, pagination);

      expect(result).toEqual(mockResult);
      expect(mockSearchService.searchAssignments).toHaveBeenCalledWith(searchTerm, pagination);
    });
  });

  describe('filter', () => {
    it('should filter assignments', async () => {
      const filters = { bookId: '1' };
      const pagination = new PaginationDto();
      const mockResult = {
        data: [{ id: '1', bookId: '1', authorId: '1' }],
        meta: { total: 1, page: 1, lastPage: 1 },
      };

      mockSearchService.findAssignmentsWithFilters.mockResolvedValue(mockResult);

      const result = await controller.filter(filters, pagination);

      expect(result).toEqual(mockResult);
      expect(mockSearchService.findAssignmentsWithFilters).toHaveBeenCalledWith(
        filters,
        pagination,
      );
    });
  });

  describe('exportToCsv', () => {
    it('should export assignments to CSV', async () => {
      const filters = { bookId: '1' };
      const csvData = 'ID,Book ID,Author ID\\n1,1,1';
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as any;

      mockSearchService.exportAssignmentsToCsv.mockResolvedValue(csvData);

      await controller.exportToCsv(filters, mockResponse);

      expect(mockSearchService.exportAssignmentsToCsv).toHaveBeenCalledWith(filters);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.send).toHaveBeenCalledWith(csvData);
    });
  });

  describe('checkAssignment', () => {
    it('should check if assignment exists', async () => {
      const bookId = 'book-1';
      const authorId = 'author-1';
      const mockCheckResult = { exists: true };

      mockBookAuthorAssignmentService.checkAssignmentExists.mockResolvedValue(mockCheckResult);

      const result = await controller.checkAssignment(bookId, authorId);

      expect(bookAuthorAssignmentService.checkAssignmentExists).toHaveBeenCalledWith(
        bookId,
        authorId,
      );
      expect(result).toEqual(mockCheckResult);
    });

    it('should return false if assignment does not exist', async () => {
      const bookId = 'book-1';
      const authorId = 'author-2';
      const mockCheckResult = { exists: false };

      mockBookAuthorAssignmentService.checkAssignmentExists.mockResolvedValue(mockCheckResult);

      const result = await controller.checkAssignment(bookId, authorId);

      expect(bookAuthorAssignmentService.checkAssignmentExists).toHaveBeenCalledWith(
        bookId,
        authorId,
      );
      expect(result).toEqual(mockCheckResult);
    });
  });

  describe('findOne', () => {
    it('should find assignment by id', async () => {
      const id = 'assignment-1';
      const mockAssignment = {
        id: 'assignment-1',
        bookId: 'book-1',
        authorId: 'author-1',
      };

      mockBookAuthorAssignmentService.findById.mockResolvedValue(mockAssignment);

      const result = await controller.findOne(id);

      expect(bookAuthorAssignmentService.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockAssignment);
    });
  });

  describe('update', () => {
    it('should update an assignment', async () => {
      const id = 'assignment-1';
      const updateDto = new UpdateBookAuthorAssignmentDto();
      updateDto.authorId = 'author-2';

      const req = { user: { id: 'user-1' } };
      const mockUpdatedAssignment = {
        id: 'assignment-1',
        bookId: 'book-1',
        authorId: 'author-2',
        updatedBy: 'user-1',
      };

      mockBookAuthorAssignmentService.update.mockResolvedValue(mockUpdatedAssignment);

      const result = await controller.update(id, updateDto, req);

      expect(bookAuthorAssignmentService.update).toHaveBeenCalledWith(id, updateDto, 'user-1');
      expect(result).toEqual(mockUpdatedAssignment);
    });
  });

  describe('remove', () => {
    it('should remove an assignment', async () => {
      const id = 'assignment-1';
      const req = { user: { id: 'user-1' } };
      const mockResult = { message: 'Assignment deleted successfully' };

      mockBookAuthorAssignmentService.softDelete.mockResolvedValue(mockResult);

      const result = await controller.remove(id, req);

      expect(bookAuthorAssignmentService.softDelete).toHaveBeenCalledWith(id, 'user-1');
      expect(result).toEqual(mockResult);
    });
  });
});
