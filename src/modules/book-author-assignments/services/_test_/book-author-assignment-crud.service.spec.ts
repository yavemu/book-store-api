import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorAssignmentCrudService } from '../book-author-assignment-crud.service';
import { IBookAuthorAssignmentCrudRepository } from '../../interfaces/book-author-assignment-crud.repository.interface';
import { IErrorHandlerService } from '../../interfaces/error-handler.service.interface';
import { IValidationService } from '../../interfaces/validation.service.interface';
import { CreateBookAuthorAssignmentDto } from '../../dto/create-book-author-assignment.dto';
import { UpdateBookAuthorAssignmentDto } from '../../dto/update-book-author-assignment.dto';
import { BookAuthorAssignment } from '../../entities/book-author-assignment.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

describe('BookAuthorAssignmentCrudService', () => {
  let service: BookAuthorAssignmentCrudService;
  let mockCrudRepository: jest.Mocked<IBookAuthorAssignmentCrudRepository>;
  let mockErrorHandler: jest.Mocked<IErrorHandlerService>;
  let mockValidationService: jest.Mocked<IValidationService>;

  const mockAssignment: BookAuthorAssignment = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    bookId: '550e8400-e29b-41d4-a716-446655440000',
    authorId: '550e8400-e29b-41d4-a716-446655440001',
    book: {} as any, // Mock relation
    author: {} as any, // Mock relation
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAssignments: BookAuthorAssignment[] = [
    mockAssignment,
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      bookId: '550e8400-e29b-41d4-a716-446655440002',
      authorId: '550e8400-e29b-41d4-a716-446655440003',
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
    bookId: '550e8400-e29b-41d4-a716-446655440000',
    authorId: '550e8400-e29b-41d4-a716-446655440001',
    authorRole: 'Main Author',
  };

  const updateDto: UpdateBookAuthorAssignmentDto = {
    authorRole: 'Co-Author',
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
      createAssignment: jest.fn(),
      getAllAssignments: jest.fn(),
      getAssignmentProfile: jest.fn(),
      updateAssignment: jest.fn(),
      deactivateAssignment: jest.fn(),
    };

    mockErrorHandler = {
      handleError: jest.fn().mockImplementation((error) => {
        throw error;
      }) as any,
      createNotFoundException: jest.fn().mockImplementation((message) => {
        const error = new Error(message);
        throw error;
      }) as any,
      createConflictException: jest.fn().mockImplementation((message) => {
        const error = new Error(message);
        throw error;
      }) as any,
    };

    mockValidationService = {
      validateUniqueConstraints: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookAuthorAssignmentCrudService,
        {
          provide: 'IBookAuthorAssignmentCrudRepository',
          useValue: mockCrudRepository,
        },
        {
          provide: 'IErrorHandlerService',
          useValue: mockErrorHandler,
        },
        {
          provide: 'IValidationService',
          useValue: mockValidationService,
        },
      ],
    }).compile();

    service = module.get<BookAuthorAssignmentCrudService>(BookAuthorAssignmentCrudService);
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('create()', () => {
    it('should create a new assignment successfully', async () => {
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      mockCrudRepository.createAssignment.mockResolvedValue(mockAssignment);

      const result = await service.create(createDto, 'user123');

      expect(result).toEqual(mockAssignment);
      expect(mockValidationService.validateUniqueConstraints).toHaveBeenCalledWith(
        createDto,
        undefined,
        expect.arrayContaining([
          expect.objectContaining({
            field: ['bookId', 'authorId'],
            message: expect.any(String),
          }),
        ]),
        mockCrudRepository,
      );
      expect(mockCrudRepository.createAssignment).toHaveBeenCalledWith(createDto, 'user123');
    });

    it('should handle validation errors during creation', async () => {
      const validationError = new Error('Assignment already exists');
      mockValidationService.validateUniqueConstraints.mockRejectedValue(validationError);

      await expect(service.create(createDto, 'user123')).rejects.toThrow(
        'Assignment already exists',
      );
    });

    it('should handle repository errors during creation', async () => {
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      const repositoryError = new Error('Database error');
      mockCrudRepository.createAssignment.mockRejectedValue(repositoryError);

      await expect(service.create(createDto, 'user123')).rejects.toThrow('Database error');
    });
  });

  describe('findAll()', () => {
    it('should return paginated assignments list', async () => {
      mockCrudRepository.getAllAssignments.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(pagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockCrudRepository.getAllAssignments).toHaveBeenCalledWith(pagination);
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
      mockCrudRepository.getAllAssignments.mockResolvedValue(emptyResult);

      const result = await service.findAll(pagination);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database connection error');
      mockCrudRepository.getAllAssignments.mockRejectedValue(repositoryError);

      await expect(service.findAll(pagination)).rejects.toThrow('Database connection error');
    });
  });

  describe('findById()', () => {
    it('should return an assignment by ID', async () => {
      mockCrudRepository.getAssignmentProfile.mockResolvedValue(mockAssignment);

      const result = await service.findById(mockAssignment.id);

      expect(result).toEqual(mockAssignment);
      expect(mockCrudRepository.getAssignmentProfile).toHaveBeenCalledWith(mockAssignment.id);
    });

    it('should handle assignment not found', async () => {
      mockCrudRepository.getAssignmentProfile.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow();
      expect(mockErrorHandler.createNotFoundException).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.getAssignmentProfile.mockRejectedValue(repositoryError);

      await expect(service.findById(mockAssignment.id)).rejects.toThrow('Database error');
    });
  });

  describe('update()', () => {
    it('should update an assignment successfully', async () => {
      const updatedAssignment = { ...mockAssignment, ...updateDto };
      mockCrudRepository.getAssignmentProfile.mockResolvedValue(mockAssignment);
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      mockCrudRepository.updateAssignment.mockResolvedValue(updatedAssignment);

      const result = await service.update(mockAssignment.id, updateDto, 'user123');

      expect(result).toEqual(updatedAssignment);
      expect(mockCrudRepository.getAssignmentProfile).toHaveBeenCalledWith(mockAssignment.id);
      expect(mockValidationService.validateUniqueConstraints).toHaveBeenCalled();
      expect(mockCrudRepository.updateAssignment).toHaveBeenCalledWith(
        mockAssignment.id,
        updateDto,
        'user123',
      );
    });

    it('should handle assignment not found during update', async () => {
      mockCrudRepository.getAssignmentProfile.mockResolvedValue(null);

      await expect(service.update('non-existent-id', updateDto, 'user123')).rejects.toThrow();
      expect(mockErrorHandler.createNotFoundException).toHaveBeenCalled();
    });

    it('should handle validation errors during update', async () => {
      mockCrudRepository.getAssignmentProfile.mockResolvedValue(mockAssignment);
      const validationError = new Error('Assignment already exists');
      mockValidationService.validateUniqueConstraints.mockRejectedValue(validationError);

      await expect(service.update(mockAssignment.id, updateDto, 'user123')).rejects.toThrow(
        'Assignment already exists',
      );
    });

    it('should handle repository errors during update', async () => {
      mockCrudRepository.getAssignmentProfile.mockResolvedValue(mockAssignment);
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      const repositoryError = new Error('Database error');
      mockCrudRepository.updateAssignment.mockRejectedValue(repositoryError);

      await expect(service.update(mockAssignment.id, updateDto, 'user123')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('remove()', () => {
    it('should remove an assignment successfully', async () => {
      const deleteResult = { id: mockAssignment.id };
      mockCrudRepository.getAssignmentProfile.mockResolvedValue(mockAssignment);
      mockCrudRepository.deactivateAssignment.mockResolvedValue(deleteResult);

      const result = await service.remove(mockAssignment.id, 'user123');

      expect(result).toBeUndefined();
      expect(mockCrudRepository.getAssignmentProfile).toHaveBeenCalledWith(mockAssignment.id);
      expect(mockCrudRepository.deactivateAssignment).toHaveBeenCalledWith(
        mockAssignment.id,
        'user123',
      );
    });

    it('should handle assignment not found during removal', async () => {
      mockCrudRepository.getAssignmentProfile.mockResolvedValue(null);

      await expect(service.remove('non-existent-id', 'user123')).rejects.toThrow();
      expect(mockErrorHandler.createNotFoundException).toHaveBeenCalled();
    });

    it('should handle repository errors during removal', async () => {
      mockCrudRepository.getAssignmentProfile.mockResolvedValue(mockAssignment);
      const repositoryError = new Error('Database error');
      mockCrudRepository.deactivateAssignment.mockRejectedValue(repositoryError);

      await expect(service.remove(mockAssignment.id, 'user123')).rejects.toThrow('Database error');
    });
  });

  describe('Error Handling', () => {
    it('should properly delegate error handling to error handler service', async () => {
      const testError = new Error('Test error');
      mockCrudRepository.getAllAssignments.mockRejectedValue(testError);

      await expect(service.findAll(pagination)).rejects.toThrow('Test error');
    });
  });

  describe('Validation Integration', () => {
    it('should validate unique constraints for bookId and authorId on creation', async () => {
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      mockCrudRepository.createAssignment.mockResolvedValue(mockAssignment);

      await service.create(createDto, 'user123');

      expect(mockValidationService.validateUniqueConstraints).toHaveBeenCalledWith(
        createDto,
        undefined,
        expect.arrayContaining([
          expect.objectContaining({
            field: ['bookId', 'authorId'],
          }),
        ]),
        mockCrudRepository,
      );
    });

    it('should check existence and validate constraints before updates', async () => {
      mockCrudRepository.getAssignmentProfile.mockResolvedValue(mockAssignment);
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      mockCrudRepository.updateAssignment.mockResolvedValue(mockAssignment);

      await service.update(mockAssignment.id, updateDto, 'user123');

      expect(mockCrudRepository.getAssignmentProfile).toHaveBeenCalledWith(mockAssignment.id);
      expect(mockValidationService.validateUniqueConstraints).toHaveBeenCalled();
    });
  });
});
