import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { InventoryMovementCrudRepository } from '../inventory-movement-crud.repository';
import { InventoryMovement } from '../../entities/inventory-movement.entity';
import { MovementType } from '../../enums/movement-type.enum';
import { MovementStatus } from '../../enums/movement-status.enum';
import { IAuditLoggerService } from '../../../audit/interfaces/audit-logger.service.interface';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { UserRole } from '../../../../common/enums/user-role.enum';

describe('InventoryMovementCrudRepository', () => {
  let repository: InventoryMovementCrudRepository;
  let movementRepository: Repository<InventoryMovement>;
  let auditLogService: IAuditLoggerService;

  const mockMovement: InventoryMovement = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    entityType: 'book',
    entityId: '456e7890-e89b-12d3-a456-426614174001',
    userId: '789e1234-e89b-12d3-a456-426614174002',
    userFullName: 'Juan Pérez',
    userRole: UserRole.ADMIN,
    priceBefore: 25000,
    priceAfter: 27000,
    quantityBefore: 50,
    quantityAfter: 45,
    movementType: MovementType.SALE,
    status: MovementStatus.COMPLETED,
    notes: 'Venta realizada exitosamente',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    validateRequiredFields: jest.fn(),
    beforeInsert: jest.fn(),
    beforeUpdate: jest.fn(),
  } as unknown as InventoryMovement;

  const mockPagination: PaginationDto = {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC' as any,
    offset: 0,
  };

  beforeEach(async () => {
    const mockTypeormRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAndCount: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
      })),
    };

    const mockAuditLogService = {
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryMovementCrudRepository,
        {
          provide: getRepositoryToken(InventoryMovement),
          useValue: mockTypeormRepo,
        },
        {
          provide: 'IAuditLoggerService',
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    repository = module.get<InventoryMovementCrudRepository>(InventoryMovementCrudRepository);
    movementRepository = module.get<Repository<InventoryMovement>>(
      getRepositoryToken(InventoryMovement),
    );
    auditLogService = module.get<IAuditLoggerService>('IAuditLoggerService');
  });

  describe('getAllMovements', () => {
    it('should return paginated movements successfully', async () => {
      const expectedResult = {
        items: [mockMovement],
        meta: {
          totalItems: 1,
          itemCount: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      // Mock _findManyWithPagination method
      jest.spyOn(repository as any, '_findManyWithPagination').mockResolvedValue(expectedResult);

      const result = await repository.getAllMovements(mockPagination);

      expect(result).toEqual(expectedResult);
      expect(repository['_findManyWithPagination']).toHaveBeenCalledWith(
        {
          where: { isActive: true },
          order: { createdAt: 'DESC' },
        },
        mockPagination,
      );
    });

    it('should throw HttpException when database error occurs', async () => {
      jest
        .spyOn(repository as any, '_findManyWithPagination')
        .mockRejectedValue(new Error('Database error'));

      await expect(repository.getAllMovements(mockPagination)).rejects.toThrow(HttpException);
      await expect(repository.getAllMovements(mockPagination)).rejects.toThrow(
        'Error al obtener los movimientos de inventario',
      );
    });
  });

  describe('getMovementById', () => {
    it('should return movement when found and active', async () => {
      jest.spyOn(repository as any, '_findById').mockResolvedValue(mockMovement);

      const result = await repository.getMovementById(mockMovement.id);

      expect(result).toEqual(mockMovement);
      expect(repository['_findById']).toHaveBeenCalledWith(mockMovement.id);
    });

    it('should throw NotFoundException when movement not found', async () => {
      jest.spyOn(repository as any, '_findById').mockResolvedValue(null);

      await expect(repository.getMovementById('nonexistent-id')).rejects.toThrow(HttpException);
      await expect(repository.getMovementById('nonexistent-id')).rejects.toThrow(
        'Movimiento de inventario no encontrado',
      );
    });

    it('should throw NotFoundException when movement is inactive', async () => {
      const inactiveMovement = { ...mockMovement, isActive: false };
      jest.spyOn(repository as any, '_findById').mockResolvedValue(inactiveMovement);

      await expect(repository.getMovementById(mockMovement.id)).rejects.toThrow(HttpException);
      await expect(repository.getMovementById(mockMovement.id)).rejects.toThrow(
        'Movimiento de inventario no encontrado',
      );
    });

    it('should throw HttpException when database error occurs', async () => {
      jest.spyOn(repository as any, '_findById').mockRejectedValue(new Error('Database error'));

      await expect(repository.getMovementById(mockMovement.id)).rejects.toThrow(HttpException);
      await expect(repository.getMovementById(mockMovement.id)).rejects.toThrow(
        'Error al obtener el movimiento de inventario',
      );
    });
  });

  describe('deactivateMovement', () => {
    it('should deactivate movement successfully', async () => {
      jest.spyOn(repository, 'getMovementById').mockResolvedValue(mockMovement);
      jest.spyOn(repository as any, '_softDelete').mockResolvedValue(undefined);

      const result = await repository.deactivateMovement(mockMovement.id, 'admin-user');

      expect(result).toEqual({ id: mockMovement.id });
      expect(repository.getMovementById).toHaveBeenCalledWith(mockMovement.id);
      expect(repository['_softDelete']).toHaveBeenCalledWith(
        mockMovement.id,
        'admin-user',
        'InventoryMovement',
        expect.any(Function),
      );
    });

    it('should use system as default deletedBy when not provided', async () => {
      jest.spyOn(repository, 'getMovementById').mockResolvedValue(mockMovement);
      jest.spyOn(repository as any, '_softDelete').mockResolvedValue(undefined);

      const result = await repository.deactivateMovement(mockMovement.id);

      expect(result).toEqual({ id: mockMovement.id });
      expect(repository['_softDelete']).toHaveBeenCalledWith(
        mockMovement.id,
        'system',
        'InventoryMovement',
        expect.any(Function),
      );
    });

    it('should throw HttpException when movement not found', async () => {
      jest
        .spyOn(repository, 'getMovementById')
        .mockRejectedValue(new HttpException('Not found', HttpStatus.NOT_FOUND));

      await expect(repository.deactivateMovement('nonexistent-id')).rejects.toThrow(HttpException);
    });

    it('should throw HttpException when database error occurs during deactivation', async () => {
      jest.spyOn(repository, 'getMovementById').mockResolvedValue(mockMovement);
      jest.spyOn(repository as any, '_softDelete').mockRejectedValue(new Error('Database error'));

      await expect(repository.deactivateMovement(mockMovement.id)).rejects.toThrow(HttpException);
      await expect(repository.deactivateMovement(mockMovement.id)).rejects.toThrow(
        'Error al desactivar el movimiento de inventario',
      );
    });
  });

  describe('error handling', () => {
    it('should preserve HttpException when already thrown', async () => {
      const customHttpException = new HttpException('Custom error', HttpStatus.BAD_REQUEST);
      jest.spyOn(repository as any, '_findById').mockRejectedValue(customHttpException);

      await expect(repository.getMovementById(mockMovement.id)).rejects.toThrow(
        customHttpException,
      );
    });

    it('should convert generic errors to HttpException with INTERNAL_SERVER_ERROR status', async () => {
      jest.spyOn(repository as any, '_findById').mockRejectedValue(new Error('Generic error'));

      await expect(repository.getMovementById(mockMovement.id)).rejects.toThrow(HttpException);

      try {
        await repository.getMovementById(mockMovement.id);
      } catch (error) {
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('soft delete description function', () => {
    it('should generate correct description for movement deactivation', async () => {
      jest.spyOn(repository, 'getMovementById').mockResolvedValue(mockMovement);

      let capturedDescriptionFunction: Function;
      jest
        .spyOn(repository as any, '_softDelete')
        .mockImplementation(
          (id: string, deletedBy: string, entityName: string, descriptionFn: Function) => {
            capturedDescriptionFunction = descriptionFn;
            return Promise.resolve();
          },
        );

      await repository.deactivateMovement(mockMovement.id, 'admin-user');

      const description = capturedDescriptionFunction(mockMovement);
      expect(description).toBe(
        `Movimiento de inventario desactivado: ${mockMovement.movementType} - ${mockMovement.entityType}:${mockMovement.entityId}`,
      );
    });
  });
});
