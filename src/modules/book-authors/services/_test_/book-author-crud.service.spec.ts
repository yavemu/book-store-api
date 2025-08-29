import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BookAuthorCrudService } from '../book-author-crud.service';
import { IBookAuthorCrudRepository } from '../../interfaces/book-author-crud.repository.interface';
import { IBookAuthorValidationRepository } from '../../interfaces/book-author-validation.repository.interface';
import { IValidationService } from '../../interfaces/validation.service.interface';
import { IErrorHandlerService } from '../../interfaces/error-handler.service.interface';
import { CreateBookAuthorDto, UpdateBookAuthorDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { BookAuthor } from '../../entities/book-author.entity';

describe('BookAuthorCrudService', () => {
  let service: BookAuthorCrudService;
  let crudRepository: IBookAuthorCrudRepository;
  let validationRepository: IBookAuthorValidationRepository;
  let validationService: IValidationService;
  let errorHandler: IErrorHandlerService;

  const mockBookAuthor: BookAuthor = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    nationality: 'American',
    birthDate: new Date('1970-01-01'),
    biography: 'A renowned author',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as BookAuthor;

  const mockCrudRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockValidationRepository = {
    findByUniqueConstraint: jest.fn(),
  };

  const mockValidationService = {
    validateUniqueConstraints: jest.fn(),
  };

  const mockErrorHandler = {
    handleError: jest.fn(),
    createNotFoundException: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookAuthorCrudService,
        { provide: 'IBookAuthorCrudRepository', useValue: mockCrudRepository },
        { provide: 'IBookAuthorValidationRepository', useValue: mockValidationRepository },
        { provide: 'IValidationService', useValue: mockValidationService },
        { provide: 'IErrorHandlerService', useValue: mockErrorHandler },
      ],
    }).compile();

    service = module.get<BookAuthorCrudService>(BookAuthorCrudService);
    crudRepository = module.get<IBookAuthorCrudRepository>('IBookAuthorCrudRepository');
    validationRepository = module.get<IBookAuthorValidationRepository>('IBookAuthorValidationRepository');
    validationService = module.get<IValidationService>('IValidationService');
    errorHandler = module.get<IErrorHandlerService>('IErrorHandlerService');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book author', async () => {
      const createDto = new CreateBookAuthorDto();
      createDto.firstName = 'John';
      createDto.lastName = 'Doe';
      const performedBy = 'user-1';
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      mockCrudRepository.create.mockResolvedValue(mockBookAuthor);

      const result = await service.create(createDto, performedBy);

      expect(validationService.validateUniqueConstraints).toHaveBeenCalledWith(
        createDto,
        undefined,
        expect.arrayContaining([
          expect.objectContaining({
            field: ['firstName', 'lastName'],
          })
        ]),
        validationRepository
      );
      expect(crudRepository.create).toHaveBeenCalledWith(createDto, performedBy);
      expect(result).toEqual(mockBookAuthor);
    });

    it('should handle validation errors during create', async () => {
      const createDto = new CreateBookAuthorDto();
      const performedBy = 'user-1';
      const validationError = new Error('Validation error');
      mockValidationService.validateUniqueConstraints.mockRejectedValue(validationError);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw validationError;
      });

      await expect(service.create(createDto, performedBy)).rejects.toThrow('Validation error');
      expect(errorHandler.handleError).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all authors', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookAuthor], meta: { total: 1, page: 1, limit: 10 } };
      mockCrudRepository.findAll.mockResolvedValue(paginatedResult);

      const result = await service.findAll(pagination);

      expect(crudRepository.findAll).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(paginatedResult);
    });

    it('should handle errors during findAll', async () => {
      const pagination = new PaginationDto();
      const repositoryError = new Error('Database error');
      mockCrudRepository.findAll.mockRejectedValue(repositoryError);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw repositoryError;
      });

      await expect(service.findAll(pagination)).rejects.toThrow('Database error');
      expect(errorHandler.handleError).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find an author by id', async () => {
      const id = '1';
      mockCrudRepository.findById.mockResolvedValue(mockBookAuthor);

      const result = await service.findById(id);

      expect(crudRepository.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockBookAuthor);
    });

    it('should call error handler when author not found', async () => {
      const id = 'non-existent-id';
      mockCrudRepository.findById.mockResolvedValue(null);
      
      // Mock createNotFoundException to not throw for this test
      mockErrorHandler.createNotFoundException.mockImplementation(() => {
        // Just record that it was called, don't actually throw
      });

      await service.findById(id);

      expect(crudRepository.findById).toHaveBeenCalledWith(id);
      expect(errorHandler.createNotFoundException).toHaveBeenCalledWith('Autor no encontrado');
    });

    it('should handle repository errors during findById', async () => {
      const id = '1';
      const repositoryError = new Error('Database connection failed');
      mockCrudRepository.findById.mockRejectedValue(repositoryError);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw repositoryError;
      });

      await expect(service.findById(id)).rejects.toThrow('Database connection failed');
      expect(errorHandler.handleError).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const id = '1';
      const updateDto = new UpdateBookAuthorDto();
      updateDto.firstName = 'Jane';
      const performedBy = 'user-1';
      const updatedAuthor = { ...mockBookAuthor, firstName: 'Jane' };
      
      mockCrudRepository.findById.mockResolvedValue(mockBookAuthor);
      mockValidationService.validateUniqueConstraints.mockResolvedValue(undefined);
      mockCrudRepository.update.mockResolvedValue(updatedAuthor);

      const result = await service.update(id, updateDto, performedBy);

      expect(crudRepository.findById).toHaveBeenCalledWith(id);
      expect(validationService.validateUniqueConstraints).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Doe',
        }),
        id,
        expect.arrayContaining([
          expect.objectContaining({
            field: ['firstName', 'lastName'],
          })
        ]),
        validationRepository
      );
      expect(crudRepository.update).toHaveBeenCalledWith(id, updateDto, performedBy);
      expect(result).toEqual(updatedAuthor);
    });

    it('should call error handler when author not found during update', async () => {
      const id = 'non-existent-id';
      const updateDto = new UpdateBookAuthorDto();
      const performedBy = 'user-1';
      
      mockCrudRepository.findById.mockResolvedValue(null);
      mockErrorHandler.createNotFoundException.mockImplementation(() => {
        // Just record that it was called, don't actually throw
      });

      await service.update(id, updateDto, performedBy);

      expect(crudRepository.findById).toHaveBeenCalledWith(id);
      expect(errorHandler.createNotFoundException).toHaveBeenCalledWith('Autor no encontrado');
    });

    it('should handle repository errors during update', async () => {
      const id = '1';
      const updateDto = new UpdateBookAuthorDto();
      const performedBy = 'user-1';
      const repositoryError = new Error('Database connection failed');
      
      mockCrudRepository.findById.mockRejectedValue(repositoryError);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw repositoryError;
      });

      await expect(service.update(id, updateDto, performedBy)).rejects.toThrow('Database connection failed');
      expect(errorHandler.handleError).toHaveBeenCalled();
    });
  });

  describe('softDelete', () => {
    it('should soft delete an author', async () => {
      const id = '1';
      const performedBy = 'user-1';
      mockCrudRepository.softDelete.mockResolvedValue(undefined);

      await service.softDelete(id, performedBy);

      expect(crudRepository.softDelete).toHaveBeenCalledWith(id, performedBy);
    });

    it('should handle errors during softDelete', async () => {
      const id = '1';
      const performedBy = 'user-1';
      const repositoryError = new Error('Database error');
      mockCrudRepository.softDelete.mockRejectedValue(repositoryError);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw repositoryError;
      });

      await expect(service.softDelete(id, performedBy)).rejects.toThrow('Database error');
      expect(errorHandler.handleError).toHaveBeenCalled();
    });
  });
});