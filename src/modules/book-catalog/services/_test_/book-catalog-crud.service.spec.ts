import { Test, TestingModule } from '@nestjs/testing';
import { BookCatalogCrudService } from '../book-catalog-crud.service';
import { IBookCatalogCrudRepository } from '../../interfaces/book-catalog-crud.repository.interface';
import { CreateBookCatalogDto, UpdateBookCatalogDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { BookCatalog } from '../../entities/book-catalog.entity';

describe('BookCatalogCrudService', () => {
  let service: BookCatalogCrudService;
  let crudRepository: IBookCatalogCrudRepository;

  const mockBookCatalog: BookCatalog = {
    id: '1',
    title: 'Test Book',
    isbnCode: '978-3-16-148410-0',
    publicationDate: new Date(),
    isAvailable: true,
    stockQuantity: 10,
    price: 29.99,
    genreId: 'genre-1',
    publisherId: 'publisher-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as BookCatalog;

  const mockCrudRepository = {
    registerBook: jest.fn(),
    getAllBooks: jest.fn(),
    getBookProfile: jest.fn(),
    updateBookProfile: jest.fn(),
    deactivateBook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookCatalogCrudService,
        { provide: 'IBookCatalogCrudRepository', useValue: mockCrudRepository },
      ],
    }).compile();

    service = module.get<BookCatalogCrudService>(BookCatalogCrudService);
    crudRepository = module.get<IBookCatalogCrudRepository>('IBookCatalogCrudRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createDto = new CreateBookCatalogDto();
      const performedBy = 'user-1';
      mockCrudRepository.registerBook.mockResolvedValue(mockBookCatalog);

      const result = await service.create(createDto, performedBy);

      expect(crudRepository.registerBook).toHaveBeenCalledWith(createDto, performedBy);
      expect(result).toEqual(mockBookCatalog);
    });
  });

  describe('findAll', () => {
    it('should find all books', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookCatalog], meta: { total: 1, page: 1, limit: 10 } };
      mockCrudRepository.getAllBooks.mockResolvedValue(paginatedResult);

      const result = await service.findAll(pagination);

      expect(crudRepository.getAllBooks).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findById', () => {
    it('should find a book by id', async () => {
      const id = '1';
      mockCrudRepository.getBookProfile.mockResolvedValue(mockBookCatalog);

      const result = await service.findById(id);

      expect(crudRepository.getBookProfile).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockBookCatalog);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const id = '1';
      const updateDto = new UpdateBookCatalogDto();
      const performedBy = 'user-1';
      const updatedBook = { ...mockBookCatalog, ...updateDto };
      mockCrudRepository.updateBookProfile.mockResolvedValue(updatedBook);

      const result = await service.update(id, updateDto, performedBy);

      expect(crudRepository.updateBookProfile).toHaveBeenCalledWith(id, updateDto, performedBy);
      expect(result).toEqual(updatedBook);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a book', async () => {
      const id = '1';
      const performedBy = 'user-1';
      mockCrudRepository.deactivateBook.mockResolvedValue(undefined);

      await service.softDelete(id, performedBy);

      expect(crudRepository.deactivateBook).toHaveBeenCalledWith(id, performedBy);
    });
  });
});