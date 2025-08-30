import { Test, TestingModule } from '@nestjs/testing';
import { BookGenreCrudService } from '../book-genre-crud.service';
import { IBookGenreCrudRepository } from '../../interfaces/book-genre-crud.repository.interface';
import { CreateBookGenreDto, UpdateBookGenreDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { BookGenre } from '../../entities/book-genre.entity';

describe('BookGenreCrudService', () => {
  let service: BookGenreCrudService;
  let crudRepository: IBookGenreCrudRepository;

  const mockBookGenre: BookGenre = {
    id: '1',
    name: 'Fantasy',
    description: 'Fantasy genre books',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as BookGenre;

  const mockCrudRepository = {
    registerGenre: jest.fn(),
    getAllGenres: jest.fn(),
    getGenreProfile: jest.fn(),
    updateGenreProfile: jest.fn(),
    deactivateGenre: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookGenreCrudService,
        { provide: 'IBookGenreCrudRepository', useValue: mockCrudRepository },
      ],
    }).compile();

    service = module.get<BookGenreCrudService>(BookGenreCrudService);
    crudRepository = module.get<IBookGenreCrudRepository>('IBookGenreCrudRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a genre', async () => {
      const createDto = new CreateBookGenreDto();
      const performedBy = 'user-1';
      mockCrudRepository.registerGenre.mockResolvedValue(mockBookGenre);

      const result = await service.create(createDto, performedBy);

      expect(crudRepository.registerGenre).toHaveBeenCalledWith(createDto, performedBy);
      expect(result).toEqual(mockBookGenre);
    });
  });

  describe('findAll', () => {
    it('should find all genres', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockBookGenre], meta: { total: 1, page: 1, limit: 10 } };
      mockCrudRepository.getAllGenres.mockResolvedValue(paginatedResult);

      const result = await service.findAll(pagination);

      expect(crudRepository.getAllGenres).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findById', () => {
    it('should find a genre by id', async () => {
      const id = '1';
      mockCrudRepository.getGenreProfile.mockResolvedValue(mockBookGenre);

      const result = await service.findById(id);

      expect(crudRepository.getGenreProfile).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockBookGenre);
    });
  });

  describe('update', () => {
    it('should update a genre', async () => {
      const id = '1';
      const updateDto = new UpdateBookGenreDto();
      const performedBy = 'user-1';
      const updatedGenre = { ...mockBookGenre, ...updateDto };
      mockCrudRepository.updateGenreProfile.mockResolvedValue(updatedGenre);

      const result = await service.update(id, updateDto, performedBy);

      expect(crudRepository.updateGenreProfile).toHaveBeenCalledWith(id, updateDto, performedBy);
      expect(result).toEqual(updatedGenre);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a genre', async () => {
      const id = '1';
      const performedBy = 'user-1';
      const deleteResult = { id: '1' };
      mockCrudRepository.deactivateGenre.mockResolvedValue(deleteResult);

      const result = await service.softDelete(id, performedBy);

      expect(crudRepository.deactivateGenre).toHaveBeenCalledWith(id, performedBy);
      expect(result).toEqual(deleteResult);
    });
  });
});
