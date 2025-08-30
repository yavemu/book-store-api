import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorsController } from '../../book-authors.controller';
import { IBookAuthorCrudService } from '../../interfaces/book-author-crud.service.interface';
import { IBookAuthorSearchService } from '../../interfaces/book-author-search.service.interface';
import { IUserContextService } from '../../interfaces/user-context.service.interface';
import { CreateBookAuthorDto, UpdateBookAuthorDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

describe('BookAuthorsController', () => {
  let controller: BookAuthorsController;
  let crudService: IBookAuthorCrudService;
  let searchService: IBookAuthorSearchService;
  let userContextService: IUserContextService;

  const mockCrudService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockSearchService = {
    search: jest.fn(),
    findByFullName: jest.fn(),
    findWithFilters: jest.fn(),
    exportToCsv: jest.fn(),
  };

  const mockUserContextService = {
    extractUserId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookAuthorsController],
      providers: [
        { provide: 'IBookAuthorCrudService', useValue: mockCrudService },
        { provide: 'IBookAuthorSearchService', useValue: mockSearchService },
        { provide: 'IUserContextService', useValue: mockUserContextService },
      ],
    }).compile();

    controller = module.get<BookAuthorsController>(BookAuthorsController);
    crudService = module.get<IBookAuthorCrudService>('IBookAuthorCrudService');
    searchService = module.get<IBookAuthorSearchService>('IBookAuthorSearchService');
    userContextService = module.get<IUserContextService>('IUserContextService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book author', async () => {
      const createDto = new CreateBookAuthorDto();
      const req = { user: { id: 'user-1' } };
      mockUserContextService.extractUserId.mockReturnValue('user-1');

      await controller.create(createDto, req);

      expect(userContextService.extractUserId).toHaveBeenCalledWith(req);
      expect(crudService.create).toHaveBeenCalledWith(createDto, 'user-1');
    });
  });

  describe('findAll', () => {
    it('should find all authors', async () => {
      const pagination = new PaginationDto();

      await controller.findAll(pagination);

      expect(crudService.findAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('search', () => {
    it('should search authors', async () => {
      const pagination = new PaginationDto();
      const searchTerm = 'test';

      await controller.search(searchTerm, pagination);

      expect(searchService.search).toHaveBeenCalledWith(searchTerm, pagination);
    });
  });

  describe('filter', () => {
    it('should filter authors', async () => {
      const filters = { firstName: 'John' };
      const pagination = new PaginationDto();
      const mockResult = {
        data: [{ id: '1', firstName: 'John', lastName: 'Doe' }],
        meta: { total: 1, page: 1, lastPage: 1 },
      };

      mockSearchService.findWithFilters.mockResolvedValue(mockResult);

      const result = await controller.filter(filters, pagination);

      expect(result).toEqual(mockResult);
      expect(searchService.findWithFilters).toHaveBeenCalledWith(filters, pagination);
    });
  });

  describe('exportToCsv', () => {
    it('should export authors to CSV', async () => {
      const filters = { firstName: 'John' };
      const csvData = 'ID,First Name,Last Name\\n1,John,Doe';
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as any;

      mockSearchService.exportToCsv.mockResolvedValue(csvData);

      await controller.exportToCsv(filters, mockResponse);

      expect(searchService.exportToCsv).toHaveBeenCalledWith(filters);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Disposition', expect.stringContaining('attachment; filename='));
      expect(mockResponse.send).toHaveBeenCalledWith(csvData);
    });
  });

  describe('findOne', () => {
    it('should find an author by id', async () => {
      const id = '1';

      await controller.findOne(id);

      expect(crudService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const id = '1';
      const updateDto = new UpdateBookAuthorDto();
      const req = { user: { id: 'user-1' } };
      mockUserContextService.extractUserId.mockReturnValue('user-1');

      await controller.update(id, updateDto, req);

      expect(userContextService.extractUserId).toHaveBeenCalledWith(req);
      expect(crudService.update).toHaveBeenCalledWith(id, updateDto, 'user-1');
    });
  });

  describe('remove', () => {
    it('should remove an author', async () => {
      const id = '1';
      const req = { user: { id: 'user-1' } };
      mockUserContextService.extractUserId.mockReturnValue('user-1');

      await controller.remove(id, req);

      expect(userContextService.extractUserId).toHaveBeenCalledWith(req);
      expect(crudService.softDelete).toHaveBeenCalledWith(id, 'user-1');
    });
  });
});
