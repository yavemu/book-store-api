import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorAssignmentsController } from '../book-author-assignments.controller';
import { IBookAuthorAssignmentService } from '../interfaces/book-author-assignment.service.interface';
import { CreateBookAuthorAssignmentDto } from '../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../dto/update-book-author-assignment.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

describe('BookAuthorAssignmentsController', () => {
  let controller: BookAuthorAssignmentsController;
  let bookAuthorAssignmentService: IBookAuthorAssignmentService;

  const mockBookAuthorAssignmentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByBook: jest.fn(),
    findByAuthor: jest.fn(),
    checkAssignmentExists: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookAuthorAssignmentsController],
      providers: [
        { provide: 'IBookAuthorAssignmentService', useValue: mockBookAuthorAssignmentService },
      ],
    }).compile();

    controller = module.get<BookAuthorAssignmentsController>(BookAuthorAssignmentsController);
    bookAuthorAssignmentService = module.get<IBookAuthorAssignmentService>('IBookAuthorAssignmentService');
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

  describe('findByBook', () => {
    it('should find assignments by book', async () => {
      const bookId = 'book-1';
      const pagination = new PaginationDto();
      
      const mockBookAssignments = {
        data: [
          {
            id: 'assignment-1',
            bookId: 'book-1',
            authorId: 'author-1',
          },
          {
            id: 'assignment-2',
            bookId: 'book-1',
            authorId: 'author-2',
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      mockBookAuthorAssignmentService.findByBook.mockResolvedValue(mockBookAssignments);

      const result = await controller.findByBook(bookId, pagination);

      expect(bookAuthorAssignmentService.findByBook).toHaveBeenCalledWith(bookId, pagination);
      expect(result).toEqual(mockBookAssignments);
    });
  });

  describe('findByAuthor', () => {
    it('should find assignments by author', async () => {
      const authorId = 'author-1';
      const pagination = new PaginationDto();
      
      const mockAuthorAssignments = {
        data: [
          {
            id: 'assignment-1',
            bookId: 'book-1',
            authorId: 'author-1',
          },
          {
            id: 'assignment-3',
            bookId: 'book-2',
            authorId: 'author-1',
          },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      mockBookAuthorAssignmentService.findByAuthor.mockResolvedValue(mockAuthorAssignments);

      const result = await controller.findByAuthor(authorId, pagination);

      expect(bookAuthorAssignmentService.findByAuthor).toHaveBeenCalledWith(authorId, pagination);
      expect(result).toEqual(mockAuthorAssignments);
    });
  });

  describe('checkAssignment', () => {
    it('should check if assignment exists', async () => {
      const bookId = 'book-1';
      const authorId = 'author-1';
      const mockCheckResult = { exists: true };

      mockBookAuthorAssignmentService.checkAssignmentExists.mockResolvedValue(mockCheckResult);

      const result = await controller.checkAssignment(bookId, authorId);

      expect(bookAuthorAssignmentService.checkAssignmentExists).toHaveBeenCalledWith(bookId, authorId);
      expect(result).toEqual(mockCheckResult);
    });

    it('should return false if assignment does not exist', async () => {
      const bookId = 'book-1';
      const authorId = 'author-2';
      const mockCheckResult = { exists: false };

      mockBookAuthorAssignmentService.checkAssignmentExists.mockResolvedValue(mockCheckResult);

      const result = await controller.checkAssignment(bookId, authorId);

      expect(bookAuthorAssignmentService.checkAssignmentExists).toHaveBeenCalledWith(bookId, authorId);
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