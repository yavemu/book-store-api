import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { BookCatalogCrudRepository } from '../book-catalog-crud.repository';
import { BookCatalog } from '../../entities/book-catalog.entity';
import { CreateBookCatalogDto } from '../../dto/create-book-catalog.dto';
import { UpdateBookCatalogDto } from '../../dto/update-book-catalog.dto';
import { IAuditLoggerService } from '../../../audit/interfaces/audit-logger.service.interface';
import { IInventoryMovementTrackerService } from '../../../inventory-movements/interfaces/inventory-movement-tracker.service.interface';

describe('BookCatalogCrudRepository - Unique Constraints', () => {
  let repository: BookCatalogCrudRepository;
  let bookRepository: Repository<BookCatalog>;
  let auditLogService: IAuditLoggerService;
  let inventoryMovementTrackerService: IInventoryMovementTrackerService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;

  const mockExistingBook: BookCatalog = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Existing Book',
    isbnCode: '9780123456789',
    price: 25000,
    isAvailable: true,
    stockQuantity: 50,
    coverImageUrl: null,
    publicationDate: new Date('2023-01-01'),
    pageCount: 300,
    summary: 'An existing book summary',
    genreId: '456e7890-e89b-12d3-a456-426614174001',
    publisherId: '789e1234-e89b-12d3-a456-426614174002',
    genre: null,
    publisher: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as BookCatalog;

  beforeEach(async () => {
    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        findOne: jest.fn(),
      },
    };

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const mockTypeormRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockAuditLogService = {
      log: jest.fn(),
    };

    const mockInventoryMovementTrackerService = {
      determineMovementType: jest.fn(),
      createPendingMovement: jest.fn(),
      markMovementCompleted: jest.fn(),
      markMovementError: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookCatalogCrudRepository,
        {
          provide: getRepositoryToken(BookCatalog),
          useValue: mockTypeormRepo,
        },
        {
          provide: 'IAuditLoggerService',
          useValue: mockAuditLogService,
        },
        {
          provide: 'IInventoryMovementTrackerService',
          useValue: mockInventoryMovementTrackerService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = module.get<BookCatalogCrudRepository>(BookCatalogCrudRepository);
    bookRepository = module.get<Repository<BookCatalog>>(getRepositoryToken(BookCatalog));
    auditLogService = module.get<IAuditLoggerService>('IAuditLoggerService');
    inventoryMovementTrackerService = module.get<IInventoryMovementTrackerService>(
      'IInventoryMovementTrackerService',
    );
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
  });

  describe('ISBN unique constraint validation', () => {
    const createBookDto: CreateBookCatalogDto = {
      title: 'New Book',
      isbnCode: '9780123456789', // Same as existing book
      price: 30000,
      isAvailable: true,
      stockQuantity: 25,
      coverImageUrl: null,
      publicationDate: new Date('2024-01-01'),
      pageCount: 400,
      summary: 'A new book summary',
      genreId: '456e7890-e89b-12d3-a456-426614174001',
      publisherId: '789e1234-e89b-12d3-a456-426614174002',
    };

    it('should throw error when trying to create book with existing ISBN', async () => {
      // Mock finding existing book with same ISBN
      jest.spyOn(repository, 'findByIsbn').mockResolvedValue(mockExistingBook);
      inventoryMovementTrackerService.determineMovementType = jest.fn().mockReturnValue('PURCHASE');
      inventoryMovementTrackerService.createPendingMovement = jest
        .fn()
        .mockResolvedValue('movement-id');

      await expect(repository.registerBook(createBookDto, 'user-id')).rejects.toThrow(
        'El código ISBN ya existe',
      );
    });

    it('should allow creating book with unique ISBN', async () => {
      const uniqueIsbnDto = { ...createBookDto, isbnCode: '9780987654321' };

      // Mock no existing book found
      jest.spyOn(repository, 'findByIsbn').mockResolvedValue(null);
      inventoryMovementTrackerService.determineMovementType = jest.fn().mockReturnValue('PURCHASE');
      inventoryMovementTrackerService.createPendingMovement = jest
        .fn()
        .mockResolvedValue('movement-id');
      inventoryMovementTrackerService.markMovementCompleted = jest
        .fn()
        .mockResolvedValue(undefined);

      queryRunner.manager.create = jest.fn().mockReturnValue(uniqueIsbnDto);
      queryRunner.manager.save = jest
        .fn()
        .mockResolvedValue({ id: 'new-book-id', ...uniqueIsbnDto });
      queryRunner.manager.update = jest.fn().mockResolvedValue(undefined);

      const result = await repository.registerBook(uniqueIsbnDto, 'user-id');

      expect(result).toEqual({ id: 'new-book-id', ...uniqueIsbnDto });
      expect(repository.findByIsbn).toHaveBeenCalledWith('9780987654321');
    });

    it('should trim ISBN code before validation', async () => {
      const dtoWithSpaces = { ...createBookDto, isbnCode: '  9780123456789  ' };

      jest.spyOn(repository, 'findByIsbn').mockResolvedValue(mockExistingBook);
      inventoryMovementTrackerService.createPendingMovement = jest
        .fn()
        .mockResolvedValue('movement-id');

      await expect(repository.registerBook(dtoWithSpaces, 'user-id')).rejects.toThrow(
        'El código ISBN ya existe',
      );
      expect(repository.findByIsbn).toHaveBeenCalledWith('9780123456789'); // Should be trimmed
    });
  });

  describe('Update unique constraint validation', () => {
    const updateBookDto: UpdateBookCatalogDto = {
      isbnCode: '9780111111111', // Different ISBN for update
      price: 35000,
    };

    it('should throw error when updating to existing ISBN', async () => {
      const existingBookId = 'different-book-id';

      // Mock current book (different from the one we're updating)
      jest.spyOn(repository, 'getBookProfile').mockResolvedValue({
        ...mockExistingBook,
        id: existingBookId,
      });

      // Mock finding another book with the same ISBN we want to update to
      jest.spyOn(repository, 'findByIsbnExcludingId').mockResolvedValue(mockExistingBook);

      await expect(
        repository.updateBookProfile(existingBookId, updateBookDto, 'user-id'),
      ).rejects.toThrow('El código ISBN ya existe');
      expect(repository.findByIsbnExcludingId).toHaveBeenCalledWith(
        '9780111111111',
        existingBookId,
      );
    });

    it('should allow updating to unique ISBN', async () => {
      const bookId = 'book-to-update';
      const currentBook = { ...mockExistingBook, id: bookId };

      jest.spyOn(repository, 'getBookProfile').mockResolvedValue(currentBook);
      jest.spyOn(repository, 'findByIsbnExcludingId').mockResolvedValue(null); // ISBN is unique

      // Mock the _update method for simple updates (no significant changes)
      jest.spyOn(repository as any, '_update').mockResolvedValue({
        ...currentBook,
        ...updateBookDto,
      });

      queryRunner.commitTransaction = jest.fn().mockResolvedValue(undefined);

      const result = await repository.updateBookProfile(bookId, updateBookDto, 'user-id');

      expect(result).toEqual(expect.objectContaining(updateBookDto));
      expect(repository.findByIsbnExcludingId).toHaveBeenCalledWith('9780111111111', bookId);
    });
  });

  describe('ISBN validation methods', () => {
    it('should find book by ISBN', async () => {
      bookRepository.findOne = jest.fn().mockResolvedValue(mockExistingBook);

      const result = await repository.findByIsbn('9780123456789');

      expect(result).toEqual(mockExistingBook);
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { isbnCode: '9780123456789' },
      });
    });

    it('should find book by ISBN excluding specific ID', async () => {
      bookRepository.findOne = jest.fn().mockResolvedValue(null);

      const result = await repository.findByIsbnExcludingId('9780123456789', 'exclude-this-id');

      expect(result).toBeNull();
      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: {
          isbnCode: '9780123456789',
          id: { not: 'exclude-this-id' },
        },
      });
    });

    it('should trim ISBN in findByIsbn method', async () => {
      bookRepository.findOne = jest.fn().mockResolvedValue(mockExistingBook);

      await repository.findByIsbn('  9780123456789  ');

      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: { isbnCode: '9780123456789' },
      });
    });

    it('should trim ISBN in findByIsbnExcludingId method', async () => {
      bookRepository.findOne = jest.fn().mockResolvedValue(null);

      await repository.findByIsbnExcludingId('  9780123456789  ', 'exclude-id');

      expect(bookRepository.findOne).toHaveBeenCalledWith({
        where: {
          isbnCode: '9780123456789',
          id: { not: 'exclude-id' },
        },
      });
    });
  });

  describe('_validateUniqueConstraints method', () => {
    const testDto = {
      isbnCode: '9780123456789',
      title: 'Test Book',
    };

    const constraints = [
      {
        field: 'isbnCode',
        message: 'El código ISBN ya existe',
        transform: (value: string) => value.trim(),
      },
    ];

    it('should pass validation when no existing entity found', async () => {
      jest.spyOn(repository, 'findByIsbn').mockResolvedValue(null);

      await expect(
        repository['_validateUniqueConstraints'](testDto, undefined, constraints),
      ).resolves.not.toThrow();
    });

    it('should fail validation when existing entity found for create operation', async () => {
      jest.spyOn(repository, 'findByIsbn').mockResolvedValue(mockExistingBook);

      await expect(
        repository['_validateUniqueConstraints'](testDto, undefined, constraints),
      ).rejects.toThrow('El código ISBN ya existe');
    });

    it('should pass validation when existing entity found for update operation but different ID', async () => {
      jest.spyOn(repository, 'findByIsbnExcludingId').mockResolvedValue(null);

      await expect(
        repository['_validateUniqueConstraints'](testDto, 'different-id', constraints),
      ).resolves.not.toThrow();
    });

    it('should fail validation when existing entity found for update operation with same constraint value', async () => {
      jest.spyOn(repository, 'findByIsbnExcludingId').mockResolvedValue(mockExistingBook);

      await expect(
        repository['_validateUniqueConstraints'](testDto, 'different-id', constraints),
      ).rejects.toThrow('El código ISBN ya existe');
    });

    it('should skip validation when field value is not provided', async () => {
      const dtoWithoutIsbn = { title: 'Test Book' };

      await expect(
        repository['_validateUniqueConstraints'](dtoWithoutIsbn, undefined, constraints),
      ).resolves.not.toThrow();
      expect(repository.findByIsbn).not.toHaveBeenCalled();
    });

    it('should apply transform function if provided', async () => {
      const dtoWithSpacedIsbn = { isbnCode: '  9780123456789  ' };
      jest.spyOn(repository, 'findByIsbn').mockResolvedValue(null);

      await repository['_validateUniqueConstraints'](dtoWithSpacedIsbn, undefined, constraints);

      expect(repository.findByIsbn).toHaveBeenCalledWith('9780123456789');
    });

    it('should handle multiple constraints', async () => {
      const multiConstraints = [
        {
          field: 'isbnCode',
          message: 'El código ISBN ya existe',
          transform: (value: string) => value.trim(),
        },
        {
          field: 'title',
          message: 'El título ya existe',
        },
      ];

      jest.spyOn(repository, 'findByIsbn').mockResolvedValue(null);

      await expect(
        repository['_validateUniqueConstraints'](testDto, undefined, multiConstraints),
      ).resolves.not.toThrow();
    });

    it('should return early when no constraints provided', async () => {
      await expect(
        repository['_validateUniqueConstraints'](testDto, undefined, undefined),
      ).resolves.not.toThrow();
      await expect(
        repository['_validateUniqueConstraints'](testDto, undefined, []),
      ).resolves.not.toThrow();
    });
  });

  describe('Transaction rollback on unique constraint errors', () => {
    it('should rollback transaction when unique constraint fails during book creation', async () => {
      const createBookDto: CreateBookCatalogDto = {
        title: 'New Book',
        isbnCode: '9780123456789',
        price: 30000,
        isAvailable: true,
        stockQuantity: 25,
        genreId: '456e7890-e89b-12d3-a456-426614174001',
        publisherId: '789e1234-e89b-12d3-a456-426614174002',
      };

      jest.spyOn(repository, 'findByIsbn').mockResolvedValue(mockExistingBook);
      inventoryMovementTrackerService.createPendingMovement = jest
        .fn()
        .mockResolvedValue('movement-id');
      inventoryMovementTrackerService.markMovementError = jest.fn().mockResolvedValue(undefined);

      await expect(repository.registerBook(createBookDto, 'user-id')).rejects.toThrow(
        HttpException,
      );

      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(inventoryMovementTrackerService.markMovementError).toHaveBeenCalledWith(
        'movement-id',
        queryRunner,
        'El código ISBN ya existe',
      );
    });
  });
});
