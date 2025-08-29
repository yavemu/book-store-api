import { Test, TestingModule } from '@nestjs/testing';
import { BookGenresController } from '../book-genres.controller';
import { IBookGenreCrudService } from '../../interfaces/book-genre-crud.service.interface';
import { IBookGenreSearchService } from '../../interfaces/book-genre-search.service.interface';
import { CreateBookGenreDto, UpdateBookGenreDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

describe('BookGenresController', () => {
  let controller: BookGenresController;
  let crudService: IBookGenreCrudService;
  let searchService: IBookGenreSearchService;

  const mockCrudService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockSearchService = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookGenresController],
      providers: [
        { provide: 'IBookGenreCrudService', useValue: mockCrudService },
        { provide: 'IBookGenreSearchService', useValue: mockSearchService },
      ],
    }).compile();

    controller = module.get<BookGenresController>(BookGenresController);
    crudService = module.get<IBookGenreCrudService>('IBookGenreCrudService');
    searchService = module.get<IBookGenreSearchService>('IBookGenreSearchService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a genre', async () => {
      const createDto = new CreateBookGenreDto();
      const req = { user: { userId: 'user-1' } };
      
      await controller.create(createDto, req);
      
      expect(crudService.create).toHaveBeenCalledWith(createDto, 'user-1');
    });
  });

  describe('findAll', () => {
    it('should find all genres', async () => {
      const pagination = new PaginationDto();
      
      await controller.findAll(pagination);
      
      expect(crudService.findAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('search', () => {
    it('should search genres', async () => {
      const pagination = new PaginationDto();
      const searchTerm = 'test';
      
      await controller.search(searchTerm, pagination);
      
      expect(searchService.search).toHaveBeenCalledWith(searchTerm, pagination);
    });
  });

  describe('findOne', () => {
    it('should find a genre by id', async () => {
      const id = '1';
      
      await controller.findOne(id);
      
      expect(crudService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a genre', async () => {
      const id = '1';
      const updateDto = new UpdateBookGenreDto();
      const req = { user: { userId: 'user-1' } };
      
      await controller.update(id, updateDto, req);
      
      expect(crudService.update).toHaveBeenCalledWith(id, updateDto, 'user-1');
    });
  });

  describe('softDelete', () => {
    it('should soft delete a genre', async () => {
      const id = '1';
      const req = { user: { userId: 'user-1' } };
      
      await controller.softDelete(id, req);
      
      expect(crudService.softDelete).toHaveBeenCalledWith(id, 'user-1');
    });
  });
});