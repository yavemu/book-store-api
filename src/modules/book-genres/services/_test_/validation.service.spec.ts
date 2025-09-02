import { Test, TestingModule } from '@nestjs/testing';
import { ValidationService } from '../validation.service';

describe('BookGenresValidationService', () => {
  let service: ValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidationService],
    }).compile();

    service = module.get<ValidationService>(ValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUniqueConstraints', () => {
    it('should return early when constraints is not provided', async () => {
      const dto = { name: 'Fantasy' };
      const repository = {
        _validateUniqueConstraints: jest.fn(),
      };

      await service.validateUniqueConstraints(dto, 'test-id', undefined, repository);

      expect(repository._validateUniqueConstraints).not.toHaveBeenCalled();
    });

    it('should return early when repository is not provided', async () => {
      const dto = { name: 'Fantasy' };
      const constraints = [
        { field: 'name', message: 'Name must be unique' },
      ];

      await expect(
        service.validateUniqueConstraints(dto, 'test-id', constraints, undefined),
      ).resolves.toBeUndefined();
    });

    it('should return early when both constraints and repository are not provided', async () => {
      const dto = { name: 'Fantasy' };

      await expect(
        service.validateUniqueConstraints(dto, 'test-id', undefined, undefined),
      ).resolves.toBeUndefined();
    });

    it('should call repository._validateUniqueConstraints when repository has the method', async () => {
      const dto = { name: 'Fantasy' };
      const entityId = 'test-id';
      const constraints = [
        { field: 'name', message: 'Name must be unique' },
      ];
      const mockRepository = {
        _validateUniqueConstraints: jest.fn().mockResolvedValue(undefined),
      };

      await service.validateUniqueConstraints(dto, entityId, constraints, mockRepository);

      expect(mockRepository._validateUniqueConstraints).toHaveBeenCalledWith(
        dto,
        entityId,
        constraints,
      );
      expect(mockRepository._validateUniqueConstraints).toHaveBeenCalledTimes(1);
    });

    it('should not call _validateUniqueConstraints when repository does not have the method', async () => {
      const dto = { name: 'Fantasy' };
      const entityId = 'test-id';
      const constraints = [
        { field: 'name', message: 'Name must be unique' },
      ];
      const mockRepository = {
        someOtherMethod: jest.fn(),
      };

      await expect(
        service.validateUniqueConstraints(dto, entityId, constraints, mockRepository),
      ).resolves.toBeUndefined();
    });

    it('should handle complex constraints with multiple fields', async () => {
      const dto = { name: 'Fantasy', code: 'FAN' };
      const entityId = 'test-id';
      const constraints = [
        { field: 'name', message: 'Name must be unique' },
        { field: ['code', 'name'], message: 'Code and name combination must be unique' },
        { 
          field: 'name', 
          message: 'Transformed name must be unique',
          transform: (value: string) => value.toLowerCase(),
        },
      ];
      const mockRepository = {
        _validateUniqueConstraints: jest.fn().mockResolvedValue(undefined),
      };

      await service.validateUniqueConstraints(dto, entityId, constraints, mockRepository);

      expect(mockRepository._validateUniqueConstraints).toHaveBeenCalledWith(
        dto,
        entityId,
        constraints,
      );
    });

    it('should work without entityId parameter', async () => {
      const dto = { name: 'Fantasy' };
      const constraints = [
        { field: 'name', message: 'Name must be unique' },
      ];
      const mockRepository = {
        _validateUniqueConstraints: jest.fn().mockResolvedValue(undefined),
      };

      await service.validateUniqueConstraints(dto, undefined, constraints, mockRepository);

      expect(mockRepository._validateUniqueConstraints).toHaveBeenCalledWith(
        dto,
        undefined,
        constraints,
      );
    });

    it('should handle repository method throwing an error', async () => {
      const dto = { name: 'Fantasy' };
      const entityId = 'test-id';
      const constraints = [
        { field: 'name', message: 'Name must be unique' },
      ];
      const mockRepository = {
        _validateUniqueConstraints: jest.fn().mockRejectedValue(new Error('Validation failed')),
      };

      await expect(
        service.validateUniqueConstraints(dto, entityId, constraints, mockRepository),
      ).rejects.toThrow('Validation failed');

      expect(mockRepository._validateUniqueConstraints).toHaveBeenCalledWith(
        dto,
        entityId,
        constraints,
      );
    });

    it('should handle empty dto', async () => {
      const dto = {};
      const entityId = 'test-id';
      const constraints = [
        { field: 'name', message: 'Name must be unique' },
      ];
      const mockRepository = {
        _validateUniqueConstraints: jest.fn().mockResolvedValue(undefined),
      };

      await service.validateUniqueConstraints(dto, entityId, constraints, mockRepository);

      expect(mockRepository._validateUniqueConstraints).toHaveBeenCalledWith(
        dto,
        entityId,
        constraints,
      );
    });

    it('should handle empty constraints array', async () => {
      const dto = { name: 'Fantasy' };
      const entityId = 'test-id';
      const constraints: any[] = [];
      const mockRepository = {
        _validateUniqueConstraints: jest.fn().mockResolvedValue(undefined),
      };

      await service.validateUniqueConstraints(dto, entityId, constraints, mockRepository);

      expect(mockRepository._validateUniqueConstraints).toHaveBeenCalledWith(
        dto,
        entityId,
        constraints,
      );
    });
  });
});