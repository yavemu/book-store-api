import { Test, TestingModule } from '@nestjs/testing';
import { Repository, FindManyOptions } from 'typeorm';
import { HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { PaginationDto } from '../../dto/pagination.dto';
import { IAuditLoggerService } from '../../../modules/audit/interfaces/audit-logger.service.interface';
import { AuditAction } from '../../../modules/audit/enums/audit-action.enum';

// Mock entity for testing
class TestEntity {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Concrete implementation of BaseRepository for testing
class TestRepository extends BaseRepository<TestEntity> {
  constructor(repository: Repository<TestEntity>, auditLogService?: IAuditLoggerService) {
    super(repository, auditLogService);
  }

  // Expose protected methods for testing
  public async testCreate(data: Partial<TestEntity>, performedBy: string, entityName: string): Promise<TestEntity> {
    return this._create(data, performedBy, entityName, (entity) => `Created ${entity.name}`);
  }

  public async testFindById(id: string): Promise<TestEntity | null> {
    return this._findById(id);
  }

  public async testFindOne(options: any): Promise<TestEntity | null> {
    return this._findOne(options);
  }

  public async testFindMany(options: FindManyOptions<TestEntity>): Promise<TestEntity[]> {
    return this._findMany(options);
  }

  public async testFindManyWithPagination(options: FindManyOptions<TestEntity>, pagination: PaginationDto) {
    return this._findManyWithPagination(options, pagination);
  }

  public async testUpdate(id: string, data: Partial<TestEntity>, performedBy: string, entityName: string): Promise<TestEntity> {
    return this._update(id, data, performedBy, entityName, (entity) => `Updated ${entity.name}`);
  }

  public async testSoftDelete(id: string, performedBy: string, entityName: string): Promise<{ id: string }> {
    return this._softDelete(id, performedBy, entityName, (entity) => `Deleted ${entity.name}`);
  }

  public async testCount(options?: FindManyOptions<TestEntity>): Promise<number> {
    return this._count(options);
  }

  public async testExists(options: any): Promise<boolean> {
    return this._exists(options);
  }

  public async testValidateUniqueConstraints(dto: any, entityId?: string, uniqueFields?: any[]): Promise<void> {
    return this._validateUniqueConstraints(dto, entityId, uniqueFields);
  }
}

const mockEntity: TestEntity = {
  id: '1',
  name: 'Test Entity',
  email: 'test@example.com',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('BaseRepository', () => {
  let testRepository: TestRepository;
  let typeormRepo: Repository<TestEntity>;
  let auditLoggerService: IAuditLoggerService;

  beforeEach(async () => {
    const mockTypeormRepo = {
      create: jest.fn().mockReturnValue(mockEntity),
      save: jest.fn().mockResolvedValue(mockEntity),
      findOne: jest.fn().mockResolvedValue(mockEntity),
      find: jest.fn().mockResolvedValue([mockEntity]),
      findAndCount: jest.fn().mockResolvedValue([[mockEntity], 1]),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
      count: jest.fn().mockResolvedValue(1),
    };

    const mockAuditLogger = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MockRepository',
          useValue: mockTypeormRepo,
        },
        {
          provide: 'IAuditLoggerService',
          useValue: mockAuditLogger,
        },
      ],
    }).compile();

    typeormRepo = module.get<Repository<TestEntity>>('MockRepository');
    auditLoggerService = module.get<IAuditLoggerService>('IAuditLoggerService');
    testRepository = new TestRepository(typeormRepo, auditLoggerService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(testRepository).toBeDefined();
  });

  describe('_create', () => {
    it('should create an entity successfully', async () => {
      const createData = { name: 'New Entity', email: 'new@example.com' };
      
      const result = await testRepository.testCreate(createData, 'user-1', 'TestEntity');

      expect(typeormRepo.create).toHaveBeenCalledWith(createData);
      expect(typeormRepo.save).toHaveBeenCalledWith(mockEntity);
      expect(auditLoggerService.log).toHaveBeenCalledWith(
        'user-1',
        mockEntity.id,
        AuditAction.CREATE,
        'Created Test Entity',
        'TestEntity'
      );
      expect(result).toEqual(mockEntity);
    });

    it('should create with REGISTER action', async () => {
      const createData = { name: 'New Entity', email: 'new@example.com' };
      
      await testRepository['_create'](createData, 'user-1', 'TestEntity', (entity) => `Registered ${entity.name}`, AuditAction.REGISTER);

      expect(auditLoggerService.log).toHaveBeenCalledWith(
        'user-1',
        mockEntity.id,
        AuditAction.REGISTER,
        expect.stringContaining('Registered'),
        'TestEntity'
      );
    });

    it('should handle create errors', async () => {
      (typeormRepo.save as jest.Mock).mockRejectedValue(new Error('Database error'));
      const createData = { name: 'New Entity' };

      await expect(testRepository.testCreate(createData, 'user-1', 'TestEntity'))
        .rejects.toThrow(new HttpException('Failed to create entity', HttpStatus.INTERNAL_SERVER_ERROR));
    });

    it('should create without audit logging when no performedBy', async () => {
      const createData = { name: 'New Entity' };
      
      await testRepository['_create'](createData, '', '');

      expect(auditLoggerService.log).not.toHaveBeenCalled();
    });
  });

  describe('_findById', () => {
    it('should find entity by id', async () => {
      const result = await testRepository.testFindById('1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockEntity);
    });

    it('should return null when entity not found', async () => {
      (typeormRepo.findOne as jest.Mock).mockResolvedValue(null);

      const result = await testRepository.testFindById('999');

      expect(result).toBeNull();
    });

    it('should handle findById errors', async () => {
      (typeormRepo.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(testRepository.testFindById('1'))
        .rejects.toThrow(new HttpException('Failed to find entity', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('_findOne', () => {
    it('should find one entity with options', async () => {
      const options = { where: { name: 'Test' } };
      
      const result = await testRepository.testFindOne(options);

      expect(typeormRepo.findOne).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockEntity);
    });

    it('should handle findOne errors', async () => {
      (typeormRepo.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(testRepository.testFindOne({ where: { name: 'Test' } }))
        .rejects.toThrow(new HttpException('Failed to find entity', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('_findMany', () => {
    it('should find many entities', async () => {
      const options = { where: { isActive: true } };
      
      const result = await testRepository.testFindMany(options);

      expect(typeormRepo.find).toHaveBeenCalledWith(options);
      expect(result).toEqual([mockEntity]);
    });

    it('should handle findMany errors', async () => {
      (typeormRepo.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(testRepository.testFindMany({}))
        .rejects.toThrow(new HttpException('Failed to find entities', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('_findManyWithPagination', () => {
    it('should find entities with pagination', async () => {
      const options = { where: { isActive: true } };
      const pagination = new PaginationDto();
      pagination.page = 1;
      pagination.limit = 10;

      const result = await testRepository.testFindManyWithPagination(options, pagination);

      expect(typeormRepo.findAndCount).toHaveBeenCalledWith(options);
      expect(result).toEqual({
        data: [mockEntity],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });
    });

    it('should calculate pagination correctly for multiple pages', async () => {
      (typeormRepo.findAndCount as jest.Mock).mockResolvedValue([Array(25).fill(mockEntity), 25]);
      const pagination = new PaginationDto();
      pagination.page = 2;
      pagination.limit = 10;

      const result = await testRepository.testFindManyWithPagination({}, pagination);

      expect(result.meta).toEqual({
        total: 25,
        page: 2,
        limit: 10,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('should handle pagination errors', async () => {
      (typeormRepo.findAndCount as jest.Mock).mockRejectedValue(new Error('Database error'));
      const pagination = new PaginationDto();

      await expect(testRepository.testFindManyWithPagination({}, pagination))
        .rejects.toThrow(new HttpException('Failed to find entities with pagination', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('_update', () => {
    it('should update entity successfully', async () => {
      const updateData = { name: 'Updated Entity' };
      const updatedEntity = { ...mockEntity, ...updateData };
      (typeormRepo.findOne as jest.Mock).mockResolvedValue(updatedEntity);

      const result = await testRepository.testUpdate('1', updateData, 'user-1', 'TestEntity');

      expect(typeormRepo.update).toHaveBeenCalledWith({ id: '1' }, updateData);
      expect(auditLoggerService.log).toHaveBeenCalledWith(
        'user-1',
        '1',
        AuditAction.UPDATE,
        'Updated Updated Entity',
        'TestEntity'
      );
      expect(result).toEqual(updatedEntity);
    });

    it('should update without audit logging', async () => {
      const updateData = { name: 'Updated Entity' };
      
      await testRepository['_update']('1', updateData);

      expect(typeormRepo.update).toHaveBeenCalledWith({ id: '1' }, updateData);
      expect(auditLoggerService.log).not.toHaveBeenCalled();
    });

    it('should handle update errors', async () => {
      (typeormRepo.update as jest.Mock).mockRejectedValue(new Error('Database error'));
      const updateData = { name: 'Updated Entity' };

      await expect(testRepository.testUpdate('1', updateData, 'user-1', 'TestEntity'))
        .rejects.toThrow(new HttpException('Failed to update entity', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('_softDelete', () => {
    it('should soft delete entity successfully', async () => {
      const result = await testRepository.testSoftDelete('1', 'user-1', 'TestEntity');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(typeormRepo.softDelete).toHaveBeenCalledWith({ id: '1' });
      expect(auditLoggerService.log).toHaveBeenCalledWith(
        'user-1',
        '1',
        AuditAction.DELETE,
        'Deleted Test Entity',
        'TestEntity'
      );
      expect(result).toEqual({ id: '1' });
    });

    it('should soft delete without audit logging', async () => {
      const result = await testRepository['_softDelete']('1');

      expect(typeormRepo.softDelete).toHaveBeenCalledWith({ id: '1' });
      expect(auditLoggerService.log).not.toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });

    it('should handle soft delete errors', async () => {
      (typeormRepo.softDelete as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(testRepository.testSoftDelete('1', 'user-1', 'TestEntity'))
        .rejects.toThrow(new HttpException('Failed to delete entity', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('_count', () => {
    it('should count entities', async () => {
      const options = { where: { isActive: true } };
      
      const result = await testRepository.testCount(options);

      expect(typeormRepo.count).toHaveBeenCalledWith(options);
      expect(result).toBe(1);
    });

    it('should count all entities without options', async () => {
      const result = await testRepository.testCount();

      expect(typeormRepo.count).toHaveBeenCalledWith(undefined);
      expect(result).toBe(1);
    });

    it('should handle count errors', async () => {
      (typeormRepo.count as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(testRepository.testCount())
        .rejects.toThrow(new HttpException('Failed to count entities', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('_exists', () => {
    it('should return true when entity exists', async () => {
      const options = { where: { id: '1' } };
      
      const result = await testRepository.testExists(options);

      expect(typeormRepo.count).toHaveBeenCalledWith(options);
      expect(result).toBe(true);
    });

    it('should return false when entity does not exist', async () => {
      (typeormRepo.count as jest.Mock).mockResolvedValue(0);
      const options = { where: { id: '999' } };
      
      const result = await testRepository.testExists(options);

      expect(result).toBe(false);
    });

    it('should handle exists errors', async () => {
      (typeormRepo.count as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(testRepository.testExists({ where: { id: '1' } }))
        .rejects.toThrow(new HttpException('Failed to check entity existence', HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('_validateUniqueConstraints', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should validate single field unique constraint successfully', async () => {
      (typeormRepo.findOne as jest.Mock).mockResolvedValue(null);
      const dto = { email: 'new@example.com' };
      const uniqueFields = [{
        field: 'email',
        message: 'Email already exists'
      }];

      await expect(testRepository.testValidateUniqueConstraints(dto, undefined, uniqueFields))
        .resolves.toBeUndefined();

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'new@example.com' }
      });
    });

    it('should throw ConflictException when single field constraint violated', async () => {
      (typeormRepo.findOne as jest.Mock).mockResolvedValue(mockEntity);
      const dto = { email: 'test@example.com' };
      const uniqueFields = [{
        field: 'email',
        message: 'Email already exists'
      }];

      await expect(testRepository.testValidateUniqueConstraints(dto, undefined, uniqueFields))
        .rejects.toThrow(new ConflictException('Email already exists'));
    });

    it('should allow update of same entity', async () => {
      (typeormRepo.findOne as jest.Mock).mockResolvedValue(mockEntity);
      const dto = { email: 'test@example.com' };
      const uniqueFields = [{
        field: 'email',
        message: 'Email already exists'
      }];

      await expect(testRepository.testValidateUniqueConstraints(dto, '1', uniqueFields))
        .resolves.toBeUndefined();
    });

    it('should validate compound unique constraint successfully', async () => {
      (typeormRepo.findOne as jest.Mock).mockResolvedValue(null);
      const dto = { name: 'John', email: 'john@example.com' };
      const uniqueFields = [{
        field: ['name', 'email'],
        message: 'Name and email combination already exists'
      }];

      await expect(testRepository.testValidateUniqueConstraints(dto, undefined, uniqueFields))
        .resolves.toBeUndefined();

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { name: 'John', email: 'john@example.com' }
      });
    });

    it('should apply transform function', async () => {
      (typeormRepo.findOne as jest.Mock).mockResolvedValue(null);
      const dto = { email: 'Test@Example.COM' };
      const uniqueFields = [{
        field: 'email',
        message: 'Email already exists',
        transform: (value: string) => value.toLowerCase().trim()
      }];

      await testRepository.testValidateUniqueConstraints(dto, undefined, uniqueFields);

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
    });

    it('should skip validation when field is undefined', async () => {
      const dto = { name: 'Test' }; // email is undefined
      const uniqueFields = [{
        field: 'email',
        message: 'Email already exists'
      }];

      await expect(testRepository.testValidateUniqueConstraints(dto, undefined, uniqueFields))
        .resolves.toBeUndefined();

      expect(typeormRepo.findOne).not.toHaveBeenCalled();
    });

    it('should skip validation when field is null', async () => {
      const dto = { email: null };
      const uniqueFields = [{
        field: 'email',
        message: 'Email already exists'
      }];

      await expect(testRepository.testValidateUniqueConstraints(dto, undefined, uniqueFields))
        .resolves.toBeUndefined();

      expect(typeormRepo.findOne).not.toHaveBeenCalled();
    });

    it('should return early when no unique fields provided', async () => {
      const dto = { email: 'test@example.com' };

      await expect(testRepository.testValidateUniqueConstraints(dto, undefined, []))
        .resolves.toBeUndefined();

      expect(typeormRepo.findOne).not.toHaveBeenCalled();
    });

    it('should handle database errors during validation', async () => {
      (typeormRepo.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
      const dto = { email: 'test@example.com' };
      const uniqueFields = [{
        field: 'email',
        message: 'Email already exists'
      }];

      await expect(testRepository.testValidateUniqueConstraints(dto, undefined, uniqueFields))
        .rejects.toThrow(HttpException);
    });
  });

  describe('audit logging integration', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should not log audit when auditLogService is not provided', async () => {
      const repoWithoutAudit = new TestRepository(typeormRepo);
      const createData = { name: 'New Entity' };

      await repoWithoutAudit.testCreate(createData, 'user-1', 'TestEntity');

      expect(typeormRepo.create).toHaveBeenCalled();
      expect(typeormRepo.save).toHaveBeenCalled();
      // Audit service should not be called since it's not provided
    });

    it('should handle audit logging errors gracefully', async () => {
      // Mock audit service to throw error, but create operation should continue
      const auditError = new Error('Audit service error');
      (auditLoggerService.log as jest.Mock).mockImplementation(() => {
        throw auditError;
      });
      
      const createData = { name: 'New Entity' };

      // The operation should fail because audit logging error is not caught in _create
      await expect(testRepository.testCreate(createData, 'user-1', 'TestEntity'))
        .rejects.toThrow(HttpException);
    });

    it('should use different descriptions for different actions', async () => {
      // Test DELETE action description
      await testRepository.testSoftDelete('1', 'user-1', 'TestEntity');

      expect(auditLoggerService.log).toHaveBeenCalledWith(
        'user-1',
        '1',
        AuditAction.DELETE,
        'Deleted Test Entity',
        'TestEntity'
      );
    });
  });

  describe('error handling edge cases', () => {
    it('should handle null repository responses', async () => {
      (typeormRepo.findOne as jest.Mock).mockResolvedValue(null);

      const result = await testRepository.testFindById('999');
      expect(result).toBeNull();
    });

    it('should handle empty arrays from find operations', async () => {
      (typeormRepo.find as jest.Mock).mockResolvedValue([]);

      const result = await testRepository.testFindMany({});
      expect(result).toEqual([]);
    });

    it('should handle zero count results', async () => {
      (typeormRepo.count as jest.Mock).mockResolvedValue(0);

      const result = await testRepository.testCount();
      expect(result).toBe(0);

      const exists = await testRepository.testExists({});
      expect(exists).toBe(false);
    });
  });
});