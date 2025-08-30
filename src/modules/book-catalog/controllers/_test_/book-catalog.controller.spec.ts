import { Test, TestingModule } from '@nestjs/testing';
import { BookCatalogController } from '../book-catalog.controller';
import { IBookCatalogCrudService } from '../../interfaces/book-catalog-crud.service.interface';
import { IBookCatalogSearchService } from '../../interfaces/book-catalog-search.service.interface';
import { CreateBookCatalogDto, UpdateBookCatalogDto, BookFiltersDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

describe('BookCatalogController', () => {
  let controller: BookCatalogController;
  let crudService: IBookCatalogCrudService;
  let searchService: IBookCatalogSearchService;

  const mockCrudService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockSearchService = {
    search: jest.fn(),
    filterSearch: jest.fn(),
    findWithFilters: jest.fn(),
    findAvailableBooks: jest.fn(),
    findByGenre: jest.fn(),
    findByPublisher: jest.fn(),
    checkIsbnExists: jest.fn(),
  };

  const mockFileUploadService = {
    uploadBookCover: jest.fn(),
    deleteBookCover: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookCatalogController],
      providers: [
        { provide: 'IBookCatalogCrudService', useValue: mockCrudService },
        { provide: 'IBookCatalogSearchService', useValue: mockSearchService },
        { provide: 'IFileUploadService', useValue: mockFileUploadService },
      ],
    }).compile();

    controller = module.get<BookCatalogController>(BookCatalogController);
    crudService = module.get<IBookCatalogCrudService>('IBookCatalogCrudService');
    searchService = module.get<IBookCatalogSearchService>('IBookCatalogSearchService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createDto = new CreateBookCatalogDto();
      const req = { user: { id: 'user-1' } };

      await controller.create(createDto, req);

      expect(crudService.create).toHaveBeenCalledWith(createDto, 'user-1');
    });
  });

  describe('findAll', () => {
    it('should find all books', async () => {
      const pagination = new PaginationDto();

      await controller.findAll(pagination);

      expect(crudService.findAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('search', () => {
    it('should search books', async () => {
      const pagination = new PaginationDto();
      const searchTerm = 'test';

      await controller.search(searchTerm, pagination);

      expect(searchService.search).toHaveBeenCalledWith(searchTerm, pagination);
    });
  });

  describe('filter', () => {
    it('should filter books with query parameter', async () => {
      const filterTerm = 'test book';
      const pagination = new PaginationDto();

      await controller.filter(filterTerm, pagination);

      expect(searchService.filterSearch).toHaveBeenCalledWith(filterTerm, pagination);
    });
  });

  describe('findAvailable', () => {
    it('should find available books', async () => {
      const pagination = new PaginationDto();

      await controller.findAvailable(pagination);

      expect(searchService.findAvailableBooks).toHaveBeenCalledWith(pagination);
    });
  });

  describe('checkIsbn', () => {
    it('should check if ISBN exists', async () => {
      const isbn = '978-3-16-148410-0';

      await controller.checkIsbn(isbn);

      expect(searchService.checkIsbnExists).toHaveBeenCalledWith(isbn);
    });
  });

  describe('findOne', () => {
    it('should find a book by id', async () => {
      const id = '1';

      await controller.findOne(id);

      expect(crudService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const id = '1';
      const updateDto = new UpdateBookCatalogDto();
      const req = { user: { id: 'user-1' } };

      await controller.update(id, updateDto, req);

      expect(crudService.update).toHaveBeenCalledWith(id, updateDto, 'user-1');
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const id = '1';
      const req = { user: { id: 'user-1' } };

      await controller.remove(id, req);

      expect(crudService.softDelete).toHaveBeenCalledWith(id, 'user-1');
    });
  });
});
