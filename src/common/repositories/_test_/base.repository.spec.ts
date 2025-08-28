import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { BaseRepository } from '../base.repository';
import { IAuditLogService } from '../../../modules/audit/interfaces/audit-log.service.interface';
import { AuditAction } from '../../../modules/audit/enums/audit-action.enum';
import { HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { PaginationDto } from '../../../common/dto/pagination.dto';

// Mock Entity
class MockEntity {
  id: string;
  name: string;
}

// Concrete Repository for testing
class MockRepository extends BaseRepository<MockEntity> {
  constructor(
    @Inject(getRepositoryToken(MockEntity))
    protected readonly repository: Repository<MockEntity>,
    @Inject('IAuditLogService')
    protected readonly auditLogService: IAuditLogService,
  ) {
    super(repository, auditLogService);
  }

  public async create(data: Partial<MockEntity>, performedBy?: string) {
    return this._createEntity(data, performedBy, 'MockEntity', (e) => `Entity ${e.name}`);
  }

  public async update(id: string, data: Partial<MockEntity>, performedBy?: string) {
    return this._updateEntity(id, data, performedBy, 'MockEntity', (e) => `Entity ${e.name}`);
  }

  public async softDelete(id: string, performedBy?: string) {
    return this._softDelete(id, performedBy, 'MockEntity', (e) => `Entity ${e.id}`);
  }

  public async findById(id: string) {
    return this._findById(id);
  }

  public async findOne(options: any) {
    return this._findOne(options);
  }

  public async findMany(options: FindManyOptions<MockEntity>) {
    return this._findMany(options);
  }

  public async findManyWithPagination(options: FindManyOptions<MockEntity>, pagination: PaginationDto) {
    return this._findManyWithPagination(options, pagination);
  }

  public async count(options?: FindManyOptions<MockEntity>) {
    return this._count(options);
  }

  public async exists(options: any) {
    return this._exists(options);
  }

  public async validateUniqueConstraints(dto: any, entityId?: string, uniqueFields?: any) {
    return this._validateUniqueConstraints(dto, entityId, uniqueFields);
  }
}

describe('BaseRepository', () => {
  let repository: MockRepository;
  let typeormRepo: Repository<MockEntity>;
  let auditLogService: IAuditLogService;

  const mockTypeormRepo = {
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
    logOperation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MockRepository,
        {
          provide: getRepositoryToken(MockEntity),
          useValue: mockTypeormRepo,
        },
        {
          provide: 'IAuditLogService',
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    repository = module.get<MockRepository>(MockRepository);
    typeormRepo = module.get<Repository<MockEntity>>(getRepositoryToken(MockEntity));
    auditLogService = module.get<IAuditLogService>('IAuditLogService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('_createEntity', () => {
    it('should create an entity and log the audit', async () => {
      const data = { name: 'test' };
      const entity = { id: '1', ...data };
      mockTypeormRepo.create.mockReturnValue(entity);
      mockTypeormRepo.save.mockResolvedValue(entity);
      mockTypeormRepo.findOne.mockResolvedValue(entity);

      const result = await repository.create(data, 'user1');

      expect(mockTypeormRepo.create).toHaveBeenCalledWith(data);
      expect(mockTypeormRepo.save).toHaveBeenCalledWith(entity);
      expect(auditLogService.logOperation).toHaveBeenCalledWith(
        'user1',
        '1',
        AuditAction.CREATE,
        `Entity test`,
        'MockEntity',
      );
      expect(result).toEqual(entity);
    });

    it('should throw an exception if creation fails', async () => {
        const data = { name: 'test' };
        mockTypeormRepo.save.mockRejectedValue(new Error('test error'));

        await expect(repository.create(data, 'user1')).rejects.toThrow(
          new HttpException('Failed to create entity', HttpStatus.INTERNAL_SERVER_ERROR),
        );
      });
  });

  describe('_findById', () => {
    it('should find an entity by id', async () => {
      const entity = { id: '1', name: 'test' };
      mockTypeormRepo.findOne.mockResolvedValue(entity);

      const result = await repository.findById('1');

      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(entity);
    });

    it('should throw an exception if findById fails', async () => {
      mockTypeormRepo.findOne.mockRejectedValue(new Error('test error'));
      await expect(repository.findById('1')).rejects.toThrow(
        new HttpException('Failed to find entity', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('_findOne', () => {
    it('should find one entity', async () => {
      const entity = { id: '1', name: 'test' };
      const options = { where: { name: 'test' } };
      mockTypeormRepo.findOne.mockResolvedValue(entity);

      const result = await repository.findOne(options);

      expect(mockTypeormRepo.findOne).toHaveBeenCalledWith(options);
      expect(result).toEqual(entity);
    });

    it('should throw an exception if findOne fails', async () => {
      const options = { where: { name: 'test' } };
      mockTypeormRepo.findOne.mockRejectedValue(new Error('test error'));
      await expect(repository.findOne(options)).rejects.toThrow(
        new HttpException('Failed to find entity', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('_findMany', () => {
    it('should find many entities', async () => {
      const entities = [{ id: '1', name: 'test' }];
      const options = { where: { name: 'test' } };
      mockTypeormRepo.find.mockResolvedValue(entities);

      const result = await repository.findMany(options);

      expect(mockTypeormRepo.find).toHaveBeenCalledWith(options);
      expect(result).toEqual(entities);
    });

    it('should throw an exception if findMany fails', async () => {
      const options = { where: { name: 'test' } };
      mockTypeormRepo.find.mockRejectedValue(new Error('test error'));
      await expect(repository.findMany(options)).rejects.toThrow(
        new HttpException('Failed to find entities', HttpStatus.INTERNAL_SERVER_ERROR),
      );
    });
  });

  describe('_findManyWithPagination', () => {
    it('should find many entities with pagination', async () => {
      const entities = [{ id: '1', name: 'test' }];
      const total = 1;
      const pagination = { limit: 10, offset: 0, page: 1, sortBy: 'name', sortOrder: 'ASC' };
      const options = { where: { name: 'test' } };
      mockTypeormRepo.findAndCount.mockResolvedValue([entities, total]);

      const result = await repository.findManyWithPagination(options, pagination as any);

      expect(mockTypeormRepo.findAndCount).toHaveBeenCalledWith(options);
      expect(result.data).toEqual(entities);
      expect(result.meta.total).toEqual(total);
    });

    it('should throw an exception if findManyWithPagination fails', async () => {
        const pagination = { limit: 10, offset: 0, page: 1, sortBy: 'name', sortOrder: 'ASC' };
        const options = { where: { name: 'test' } };
        mockTypeormRepo.findAndCount.mockRejectedValue(new Error('test error'));
        await expect(repository.findManyWithPagination(options, pagination as any)).rejects.toThrow(
            new HttpException("Failed to find entities with pagination", HttpStatus.INTERNAL_SERVER_ERROR)
        );
      });
  });

  describe('_updateEntity', () => {
    it('should update an entity and log the audit', async () => {
      const data = { name: 'updated' };
      const entity = { id: '1', name: 'test' };
      mockTypeormRepo.findOne.mockResolvedValue(entity);
      await repository.update('1', data, 'user1');

      expect(mockTypeormRepo.update).toHaveBeenCalledWith({ id: '1' }, data);
      expect(auditLogService.logOperation).toHaveBeenCalled();
    });

    it('should throw an exception if update fails', async () => {
        const data = { name: 'updated' };
        mockTypeormRepo.update.mockRejectedValue(new Error('test error'));
        await expect(repository.update('1', data, 'user1')).rejects.toThrow(
            new HttpException("Failed to update entity", HttpStatus.INTERNAL_SERVER_ERROR)
        );
      });
  });

  describe('_softDelete', () => {
    it('should soft delete an entity and log the audit', async () => {
        const entity = { id: '1', name: 'test' };
        mockTypeormRepo.findOne.mockResolvedValue(entity);
      await repository.softDelete('1', 'user1');

      expect(mockTypeormRepo.softDelete).toHaveBeenCalledWith({ id: '1' });
      expect(auditLogService.logOperation).toHaveBeenCalled();
    });

    it('should throw an exception if soft delete fails', async () => {
        mockTypeormRepo.softDelete.mockRejectedValue(new Error('test error'));
        await expect(repository.softDelete('1', 'user1')).rejects.toThrow(
            new HttpException("Failed to delete entity", HttpStatus.INTERNAL_SERVER_ERROR)
        );
      });
  });

  describe('_count', () => {
    it('should count entities', async () => {
      mockTypeormRepo.count.mockResolvedValue(5);
      const result = await repository.count();
      expect(result).toBe(5);
    });

    it('should throw an exception if count fails', async () => {
        mockTypeormRepo.count.mockRejectedValue(new Error('test error'));
        await expect(repository.count()).rejects.toThrow(
            new HttpException("Failed to count entities", HttpStatus.INTERNAL_SERVER_ERROR)
        );
      });
  });

  describe('_exists', () => {
    it('should return true if entity exists', async () => {
      mockTypeormRepo.count.mockResolvedValue(1);
      const result = await repository.exists({ where: { name: 'test' } });
      expect(result).toBe(true);
    });

    it('should return false if entity does not exist', async () => {
      mockTypeormRepo.count.mockResolvedValue(0);
      const result = await repository.exists({ where: { name: 'test' } });
      expect(result).toBe(false);
    });

    it('should throw an exception if exists check fails', async () => {
        mockTypeormRepo.count.mockRejectedValue(new Error('test error'));
        await expect(repository.exists({ where: { name: 'test' } })).rejects.toThrow(
            new HttpException("Failed to check entity existence", HttpStatus.INTERNAL_SERVER_ERROR)
        );
      });
  });

  describe('_validateUniqueConstraints', () => {
    it('should not throw if field is unique', async () => {
      mockTypeormRepo.findOne.mockResolvedValue(null);
      await expect(repository.validateUniqueConstraints({ name: 'test' }, undefined, [{ field: 'name', message: 'error' }])).resolves.not.toThrow();
    });

    it('should throw if field is not unique', async () => {
      mockTypeormRepo.findOne.mockResolvedValue({ id: '2', name: 'test' });
      await expect(repository.validateUniqueConstraints({ name: 'test' }, '1', [{ field: 'name', message: 'error' }])).rejects.toThrow(
        new ConflictException('error'),
      );
    });

    it('should not throw for same entity', async () => {
        mockTypeormRepo.findOne.mockResolvedValue({ id: '1', name: 'test' });
        await expect(repository.validateUniqueConstraints({ name: 'test' }, '1', [{ field: 'name', message: 'error' }])).resolves.not.toThrow();
      });

    it('should handle thrown conflict exception', async () => {
        mockTypeormRepo.findOne.mockResolvedValue({ id: '2', name: 'test' });
        await expect(repository.validateUniqueConstraints({ name: 'test' }, '1', [{ field: 'name', message: 'error' }])).rejects.toThrow(
          new ConflictException('error'),
        );
      });

    it('should handle other exceptions', async () => {
        mockTypeormRepo.findOne.mockRejectedValue(new Error('db error'));
        await expect(repository.validateUniqueConstraints({ name: 'test' }, '1', [{ field: 'name', message: 'error' }])).rejects.toThrow(
            new HttpException('Failed to validate unique constraints: Failed to find entity', HttpStatus.INTERNAL_SERVER_ERROR),
        );
      });
  });
});
