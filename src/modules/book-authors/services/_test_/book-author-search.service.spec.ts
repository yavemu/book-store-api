import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BookAuthorSearchService } from '../book-author-search.service';
import { IBookAuthorSearchRepository } from '../../interfaces/book-author-search.repository.interface';
import { IErrorHandlerService } from '../../interfaces/error-handler.service.interface';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { BookAuthor } from '../../entities/book-author.entity';

describe('BookAuthorSearchService', () => {
  let service: BookAuthorSearchService;
  let searchRepository: IBookAuthorSearchRepository;
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

  const mockSearchRepository = {
    searchByTerm: jest.fn(),
    findByFullName: jest.fn(),
  };

  const mockErrorHandler = {
    handleError: jest.fn(),
    createNotFoundException: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookAuthorSearchService,
        { provide: 'IBookAuthorSearchRepository', useValue: mockSearchRepository },
        { provide: 'IErrorHandlerService', useValue: mockErrorHandler },
      ],
    }).compile();

    service = module.get<BookAuthorSearchService>(BookAuthorSearchService);
    searchRepository = module.get<IBookAuthorSearchRepository>('IBookAuthorSearchRepository');
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

  describe('search', () => {
    it('should search authors by term', async () => {
      const searchTerm = 'John';
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookAuthor], meta: { total: 1, page: 1, limit: 10 } };
      mockSearchRepository.searchByTerm.mockResolvedValue(paginatedResult);

      const result = await service.search(searchTerm, pagination);

      expect(searchRepository.searchByTerm).toHaveBeenCalledWith(searchTerm, pagination);
      expect(result).toEqual(paginatedResult);
    });

    it('should handle errors during search', async () => {
      const searchTerm = 'John';
      const pagination = new PaginationDto();
      const repositoryError = new Error('Database error');
      mockSearchRepository.searchByTerm.mockRejectedValue(repositoryError);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw repositoryError;
      });

      await expect(service.search(searchTerm, pagination)).rejects.toThrow('Database error');
      expect(errorHandler.handleError).toHaveBeenCalled();
    });
  });

  describe('findByFullName', () => {
    it('should find author by full name', async () => {
      const firstName = 'John';
      const lastName = 'Doe';
      mockSearchRepository.findByFullName.mockResolvedValue(mockBookAuthor);

      const result = await service.findByFullName(firstName, lastName);

      expect(searchRepository.findByFullName).toHaveBeenCalledWith(firstName, lastName);
      expect(result).toEqual(mockBookAuthor);
    });

    it('should call error handler when author not found', async () => {
      const firstName = 'NonExistent';
      const lastName = 'Author';
      mockSearchRepository.findByFullName.mockResolvedValue(null);
      mockErrorHandler.createNotFoundException.mockImplementation(() => {
        // Just record that it was called, don't actually throw
      });

      await service.findByFullName(firstName, lastName);

      expect(searchRepository.findByFullName).toHaveBeenCalledWith(firstName, lastName);
      expect(errorHandler.createNotFoundException).toHaveBeenCalledWith('Autor no encontrado');
    });

    it('should handle repository errors during findByFullName', async () => {
      const firstName = 'John';
      const lastName = 'Doe';
      const repositoryError = new Error('Database connection failed');
      mockSearchRepository.findByFullName.mockRejectedValue(repositoryError);
      mockErrorHandler.handleError.mockImplementation(() => {
        throw repositoryError;
      });

      await expect(service.findByFullName(firstName, lastName)).rejects.toThrow('Database connection failed');
      expect(errorHandler.handleError).toHaveBeenCalled();
    });

  });
});