import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { BookAuthorRepository } from '../book-author.repository';
import { BookAuthor } from '../../entities/book-author.entity';
import { CreateBookAuthorDto, UpdateBookAuthorDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { IAuditLoggerService } from '../../../audit/interfaces/audit-logger.service.interface';

describe('BookAuthorRepository', () => {
  let repository: BookAuthorRepository;
  let typeormRepository: Repository<BookAuthor>;
  let auditLogService: IAuditLoggerService;

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

  const mockTypeormRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    count: jest.fn(),
  };

  const mockAuditLogService = {
    logAction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookAuthorRepository,
        {
          provide: getRepositoryToken(BookAuthor),
          useValue: mockTypeormRepository,
        },
        {
          provide: 'IAuditLoggerService',
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    repository = module.get<BookAuthorRepository>(BookAuthorRepository);
    typeormRepository = module.get<Repository<BookAuthor>>(getRepositoryToken(BookAuthor));
    auditLogService = module.get<IAuditLoggerService>('IAuditLoggerService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a book author', async () => {
      const createDto = new CreateBookAuthorDto();
      createDto.firstName = 'John';
      createDto.lastName = 'Doe';
      const performedBy = 'user-1';

      mockTypeormRepository.create.mockReturnValue(mockBookAuthor);
      mockTypeormRepository.save.mockResolvedValue(mockBookAuthor);

      const result = await repository.create(createDto, performedBy);

      expect(typeormRepository.create).toHaveBeenCalledWith(createDto);
      expect(typeormRepository.save).toHaveBeenCalledWith(mockBookAuthor);
      expect(result).toEqual(mockBookAuthor);
    });
  });

  describe('findById', () => {
    it('should find an author by id', async () => {
      const id = '1';
      mockTypeormRepository.findOne.mockResolvedValue(mockBookAuthor);

      const result = await repository.findById(id);

      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockBookAuthor);
    });

    it('should return null if author not found', async () => {
      const id = 'non-existent';
      mockTypeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all authors with pagination', async () => {
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      pagination.sortBy = 'createdAt';
      pagination.sortOrder = 'DESC';

      const paginatedResult = {
        data: [mockBookAuthor],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };

      mockTypeormRepository.findAndCount.mockResolvedValue([[mockBookAuthor], 1]);

      const result = await repository.findAll(pagination);

      expect(typeormRepository.findAndCount).toHaveBeenCalledWith({
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: 0,
        take: pagination.limit,
      });
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('update', () => {
    it('should update an author', async () => {
      const id = '1';
      const updateDto = new UpdateBookAuthorDto();
      updateDto.firstName = 'Jane';
      const performedBy = 'user-1';
      const updatedAuthor = { ...mockBookAuthor, firstName: 'Jane' };

      mockTypeormRepository.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepository.findOne.mockResolvedValue(updatedAuthor);

      const result = await repository.update(id, updateDto, performedBy);

      expect(typeormRepository.update).toHaveBeenCalledWith({ id }, updateDto);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(updatedAuthor);
    });

    it('should handle birth date conversion during update', async () => {
      const id = '1';
      const updateDto = new UpdateBookAuthorDto();
      updateDto.birthDate = new Date('1975-05-15');
      const performedBy = 'user-1';

      mockTypeormRepository.update.mockResolvedValue({ affected: 1 });
      mockTypeormRepository.findOne.mockResolvedValue(mockBookAuthor);

      await repository.update(id, updateDto, performedBy);

      expect(typeormRepository.update).toHaveBeenCalledWith(
        { id },
        {
          ...updateDto,
          birthDate: new Date('1975-05-15'),
        },
      );
    });
  });

  describe('softDelete', () => {
    it('should soft delete an author', async () => {
      const id = '1';
      const performedBy = 'user-1';

      // Mock the base repository _softDelete method behavior
      const deletedResult = { id };
      jest.spyOn(repository as any, '_softDelete').mockResolvedValue(deletedResult);

      const result = await repository.softDelete(id, performedBy);

      expect(result).toEqual(deletedResult);
    });
  });

  describe('searchByTerm', () => {
    it('should search authors by term', async () => {
      const searchTerm = 'John';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      pagination.sortBy = 'createdAt';
      pagination.sortOrder = 'DESC';

      mockTypeormRepository.findAndCount.mockResolvedValue([[mockBookAuthor], 1]);

      const result = await repository.searchByTerm(searchTerm, pagination);

      expect(typeormRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.arrayContaining([
            expect.objectContaining({ firstName: expect.any(Object) }),
            expect.objectContaining({ lastName: expect.any(Object) }),
            expect.objectContaining({ nationality: expect.any(Object) }),
          ]),
          order: { [pagination.sortBy]: pagination.sortOrder },
          skip: 0,
          take: pagination.limit,
        }),
      );
      expect(result.data).toEqual([mockBookAuthor]);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findByNationality', () => {
    it('should find authors by nationality', async () => {
      const nationality = 'American';
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;
      pagination.sortBy = 'createdAt';
      pagination.sortOrder = 'DESC';

      mockTypeormRepository.findAndCount.mockResolvedValue([[mockBookAuthor], 1]);

      const result = await repository.findByNationality(nationality, pagination);

      expect(typeormRepository.findAndCount).toHaveBeenCalledWith({
        where: { nationality },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: 0,
        take: pagination.limit,
      });
      expect(result.data).toEqual([mockBookAuthor]);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findByFullName', () => {
    it('should find author by full name', async () => {
      const firstName = 'John';
      const lastName = 'Doe';
      mockTypeormRepository.findOne.mockResolvedValue(mockBookAuthor);

      const result = await repository.findByFullName(firstName, lastName);

      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        },
      });
      expect(result).toEqual(mockBookAuthor);
    });

    it('should return null if author not found by full name', async () => {
      const firstName = 'Jane';
      const lastName = 'Smith';
      mockTypeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByFullName(firstName, lastName);

      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('checkFullNameExists', () => {
    it('should return true if full name exists', async () => {
      const firstName = 'John';
      const lastName = 'Doe';
      mockTypeormRepository.count.mockResolvedValue(1);

      // Mock the base repository _exists method
      jest.spyOn(repository as any, '_exists').mockResolvedValue(true);

      const result = await repository.checkFullNameExists(firstName, lastName);

      expect(result).toBe(true);
    });

    it('should return false if full name does not exist', async () => {
      const firstName = 'Jane';
      const lastName = 'Smith';
      mockTypeormRepository.count.mockResolvedValue(0);

      // Mock the base repository _exists method
      jest.spyOn(repository as any, '_exists').mockResolvedValue(false);

      const result = await repository.checkFullNameExists(firstName, lastName);

      expect(result).toBe(false);
    });
  });
});
