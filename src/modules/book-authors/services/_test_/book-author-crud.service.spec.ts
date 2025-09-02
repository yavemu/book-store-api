import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorCrudService } from '../book-author-crud.service';
import { IBookAuthorCrudRepository } from '../../interfaces/book-author-crud.repository.interface';
import { IBookAuthorValidationRepository } from '../../interfaces/book-author-validation.repository.interface';
import { IErrorHandlerService } from '../../interfaces/error-handler.service.interface';
import { IValidationService } from '../../interfaces/validation.service.interface';
import { CreateBookAuthorDto } from '../../dto/create-book-author.dto';
import { UpdateBookAuthorDto } from '../../dto/update-book-author.dto';
import { BookAuthor } from '../../entities/book-author.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

describe('BookAuthorCrudService', () => {
  let service: BookAuthorCrudService;
  let mockCrudRepository: jest.Mocked<IBookAuthorCrudRepository>;
  let mockValidationRepository: jest.Mocked<IBookAuthorValidationRepository>;
  let mockErrorHandler: jest.Mocked<IErrorHandlerService>;
  let mockValidationService: jest.Mocked<IValidationService>;

  const mockAuthor: BookAuthor = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'Stephen',
    lastName: 'King',
    nationality: 'American',
    birthDate: new Date('1947-09-21'),
    biography: 'Renowned horror novelist',
    email: 'stephen@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockAuthors: BookAuthor[] = [
    mockAuthor,
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      firstName: 'J.K.',
      lastName: 'Rowling',
      nationality: 'British',
      birthDate: new Date('1965-07-31'),
      biography: 'Author of Harry Potter series',
      email: 'jk@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  const mockPaginatedResult = {
    data: mockAuthors,
    meta: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };

  const createDto: CreateBookAuthorDto = {
    firstName: 'Stephen',
    lastName: 'King',
    nationality: 'American',
    birthDate: new Date('1947-09-21'),
    biography: 'Renowned horror novelist',
  };

  const updateDto: UpdateBookAuthorDto = {
    biography: 'Updated biography',
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
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    mockValidationRepository = {
      checkFullNameExists: jest.fn(),
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
        BookAuthorCrudService,
        {
          provide: 'IBookAuthorCrudRepository',
          useValue: mockCrudRepository,
        },
        {
          provide: 'IBookAuthorValidationRepository',
          useValue: mockValidationRepository,
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

    service = module.get<BookAuthorCrudService>(BookAuthorCrudService);
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('create()', () => {
    it('should create a new author successfully', async () => {
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      mockCrudRepository.create.mockResolvedValue(mockAuthor);

      const result = await service.create(createDto, 'user123');

      expect(result).toEqual(mockAuthor);
      expect(mockValidationService.validateUniqueConstraints).toHaveBeenCalledWith(
        createDto,
        undefined,
        expect.arrayContaining([
          expect.objectContaining({
            field: ['firstName', 'lastName'],
            message: expect.any(String),
            transform: expect.any(Function),
          }),
        ]),
        mockValidationRepository,
      );
      expect(mockCrudRepository.create).toHaveBeenCalledWith(createDto, 'user123');
    });

    it('should handle validation errors during creation', async () => {
      const validationError = new Error('Unique constraint violation');
      mockValidationService.validateUniqueConstraints.mockRejectedValue(validationError);

      await expect(service.create(createDto, 'user123')).rejects.toThrow(
        'Unique constraint violation',
      );
    });

    it('should handle repository errors during creation', async () => {
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      const repositoryError = new Error('Database error');
      mockCrudRepository.create.mockRejectedValue(repositoryError);

      await expect(service.create(createDto, 'user123')).rejects.toThrow('Database error');
    });
  });

  describe('findAll()', () => {
    it('should return paginated authors list', async () => {
      mockCrudRepository.findAll.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(pagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockCrudRepository.findAll).toHaveBeenCalledWith(pagination);
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
      mockCrudRepository.findAll.mockResolvedValue(emptyResult);

      const result = await service.findAll(pagination);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database connection error');
      mockCrudRepository.findAll.mockRejectedValue(repositoryError);

      await expect(service.findAll(pagination)).rejects.toThrow('Database connection error');
    });
  });

  describe('findById()', () => {
    it('should return an author by ID', async () => {
      mockCrudRepository.findById.mockResolvedValue(mockAuthor);

      const result = await service.findById(mockAuthor.id);

      expect(result).toEqual(mockAuthor);
      expect(mockCrudRepository.findById).toHaveBeenCalledWith(mockAuthor.id);
    });

    it('should handle author not found', async () => {
      mockCrudRepository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent-id')).rejects.toThrow();
      expect(mockErrorHandler.createNotFoundException).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.findById.mockRejectedValue(repositoryError);

      await expect(service.findById(mockAuthor.id)).rejects.toThrow('Database error');
    });
  });

  describe('update()', () => {
    it('should update an author successfully', async () => {
      const updatedAuthor = { ...mockAuthor, ...updateDto };
      mockCrudRepository.findById.mockResolvedValue(mockAuthor);
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      mockCrudRepository.update.mockResolvedValue(updatedAuthor);

      const result = await service.update(mockAuthor.id, updateDto, 'user123');

      expect(result).toEqual(updatedAuthor);
      expect(mockCrudRepository.findById).toHaveBeenCalledWith(mockAuthor.id);
      expect(mockValidationService.validateUniqueConstraints).toHaveBeenCalled();
      expect(mockCrudRepository.update).toHaveBeenCalledWith(mockAuthor.id, updateDto, 'user123');
    });

    it('should handle author not found during update', async () => {
      mockCrudRepository.findById.mockResolvedValue(null);

      await expect(service.update('non-existent-id', updateDto, 'user123')).rejects.toThrow();
      expect(mockErrorHandler.createNotFoundException).toHaveBeenCalled();
    });

    it('should handle validation errors during update', async () => {
      mockCrudRepository.findById.mockResolvedValue(mockAuthor);
      const validationError = new Error('Unique constraint violation');
      mockValidationService.validateUniqueConstraints.mockRejectedValue(validationError);

      await expect(service.update(mockAuthor.id, updateDto, 'user123')).rejects.toThrow(
        'Unique constraint violation',
      );
    });

    it('should handle repository errors during update', async () => {
      mockCrudRepository.findById.mockResolvedValue(mockAuthor);
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      const repositoryError = new Error('Database error');
      mockCrudRepository.update.mockRejectedValue(repositoryError);

      await expect(service.update(mockAuthor.id, updateDto, 'user123')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('softDelete()', () => {
    it('should soft delete an author successfully', async () => {
      mockCrudRepository.softDelete.mockResolvedValue({ id: mockAuthor.id });

      const result = await service.softDelete(mockAuthor.id, 'user123');

      expect(result).toBeUndefined();
      expect(mockCrudRepository.softDelete).toHaveBeenCalledWith(mockAuthor.id, 'user123');
    });

    it('should handle repository errors during deletion', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.softDelete.mockRejectedValue(repositoryError);

      await expect(service.softDelete(mockAuthor.id, 'user123')).rejects.toThrow('Database error');
    });
  });

  describe('Error Handling', () => {
    it('should properly delegate error handling to error handler service', async () => {
      const testError = new Error('Test error');
      mockCrudRepository.findAll.mockRejectedValue(testError);

      await expect(service.findAll(pagination)).rejects.toThrow('Test error');
    });
  });

  describe('Validation Integration', () => {
    it('should validate unique constraints for names on creation', async () => {
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      mockCrudRepository.create.mockResolvedValue(mockAuthor);

      await service.create(createDto, 'user123');

      expect(mockValidationService.validateUniqueConstraints).toHaveBeenCalledWith(
        createDto,
        undefined,
        expect.arrayContaining([
          expect.objectContaining({
            field: ['firstName', 'lastName'],
          }),
        ]),
        mockValidationRepository,
      );
    });

    it('should check existence and validate constraints before updates', async () => {
      mockCrudRepository.findById.mockResolvedValue(mockAuthor);
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      mockCrudRepository.update.mockResolvedValue(mockAuthor);

      await service.update(mockAuthor.id, updateDto, 'user123');

      expect(mockCrudRepository.findById).toHaveBeenCalledWith(mockAuthor.id);
      expect(mockValidationService.validateUniqueConstraints).toHaveBeenCalled();
    });
  });
});
