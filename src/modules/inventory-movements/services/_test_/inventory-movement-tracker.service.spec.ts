import { Test, TestingModule } from '@nestjs/testing';
import { QueryRunner } from 'typeorm';
import { InventoryMovementTrackerService } from '../inventory-movement-tracker.service';
import { InventoryMovement } from '../../entities/inventory-movement.entity';
import { MovementType } from '../../enums/movement-type.enum';
import { MovementStatus } from '../../enums/movement-status.enum';
import { MovementTrackingData } from '../../interfaces/inventory-movement-tracker.service.interface';

describe('InventoryMovementTrackerService', () => {
  let service: InventoryMovementTrackerService;
  let mockQueryRunner: QueryRunner;

  const mockTrackingData: MovementTrackingData = {
    entityType: 'book',
    entityId: '456e7890-e89b-12d3-a456-426614174001',
    userId: '789e1234-e89b-12d3-a456-426614174002',
    userFullName: 'Juan Pérez García',
    userRole: 'ADMIN',
    priceBefore: 25000,
    priceAfter: 27000,
    quantityBefore: 50,
    quantityAfter: 45,
    movementType: MovementType.SALE,
    notes: 'Venta realizada exitosamente',
  };

  beforeEach(async () => {
    mockQueryRunner = {
      manager: {
        save: jest.fn(),
        update: jest.fn(),
      },
    } as unknown as QueryRunner;

    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryMovementTrackerService],
    }).compile();

    service = module.get<InventoryMovementTrackerService>(InventoryMovementTrackerService);
  });

  describe('createPendingMovement', () => {
    it('should create pending movement successfully', async () => {
      const savedMovement = { id: 'saved-movement-id', ...mockTrackingData };
      mockQueryRunner.manager.save = jest.fn().mockResolvedValue(savedMovement);

      const result = await service.createPendingMovement(mockTrackingData, mockQueryRunner);

      expect(result).toBe('saved-movement-id');
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        InventoryMovement,
        expect.objectContaining({
          entityType: mockTrackingData.entityType,
          entityId: mockTrackingData.entityId,
          userId: mockTrackingData.userId,
          userFullName: mockTrackingData.userFullName,
          userRole: mockTrackingData.userRole,
          priceBefore: mockTrackingData.priceBefore,
          priceAfter: mockTrackingData.priceAfter,
          quantityBefore: mockTrackingData.quantityBefore,
          quantityAfter: mockTrackingData.quantityAfter,
          movementType: mockTrackingData.movementType,
          status: MovementStatus.PENDING,
          notes: mockTrackingData.notes,
          isActive: true,
        }),
      );
    });

    it('should handle optional fields correctly', async () => {
      const minimalData: MovementTrackingData = {
        entityType: 'book',
        entityId: '456e7890-e89b-12d3-a456-426614174001',
        userId: '789e1234-e89b-12d3-a456-426614174002',
        userFullName: 'Juan Pérez García',
        userRole: 'ADMIN',
        movementType: MovementType.PURCHASE,
      };

      const savedMovement = { id: 'saved-movement-id', ...minimalData };
      mockQueryRunner.manager.save = jest.fn().mockResolvedValue(savedMovement);

      const result = await service.createPendingMovement(minimalData, mockQueryRunner);

      expect(result).toBe('saved-movement-id');
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        InventoryMovement,
        expect.objectContaining({
          priceBefore: undefined,
          priceAfter: undefined,
          quantityBefore: undefined,
          quantityAfter: undefined,
          notes: undefined,
        }),
      );
    });
  });

  describe('markMovementCompleted', () => {
    const movementId = 'test-movement-id';

    it('should mark movement as completed without updated values', async () => {
      mockQueryRunner.manager.update = jest.fn().mockResolvedValue(undefined);

      await service.markMovementCompleted(movementId, mockQueryRunner);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        InventoryMovement,
        { id: movementId },
        expect.objectContaining({
          status: MovementStatus.COMPLETED,
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should mark movement as completed with updated values', async () => {
      const updatedValues: Partial<MovementTrackingData> = {
        priceAfter: 30000,
        quantityAfter: 40,
        movementType: MovementType.INCREASE,
      };

      mockQueryRunner.manager.update = jest.fn().mockResolvedValue(undefined);

      await service.markMovementCompleted(movementId, mockQueryRunner, updatedValues);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        InventoryMovement,
        { id: movementId },
        expect.objectContaining({
          status: MovementStatus.COMPLETED,
          priceAfter: 30000,
          quantityAfter: 40,
          movementType: MovementType.INCREASE,
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should change movement type to OUT_OF_STOCK when quantity becomes 0', async () => {
      const updatedValues: Partial<MovementTrackingData> = {
        quantityAfter: 0,
      };

      mockQueryRunner.manager.update = jest.fn().mockResolvedValue(undefined);

      await service.markMovementCompleted(movementId, mockQueryRunner, updatedValues);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        InventoryMovement,
        { id: movementId },
        expect.objectContaining({
          status: MovementStatus.COMPLETED,
          quantityAfter: 0,
          movementType: MovementType.OUT_OF_STOCK,
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should not change movement type to OUT_OF_STOCK when quantity is not 0', async () => {
      const updatedValues: Partial<MovementTrackingData> = {
        quantityAfter: 5,
        movementType: MovementType.SALE,
      };

      mockQueryRunner.manager.update = jest.fn().mockResolvedValue(undefined);

      await service.markMovementCompleted(movementId, mockQueryRunner, updatedValues);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        InventoryMovement,
        { id: movementId },
        expect.objectContaining({
          status: MovementStatus.COMPLETED,
          quantityAfter: 5,
          movementType: MovementType.SALE,
          updatedAt: expect.any(Date),
        }),
      );
    });
  });

  describe('markMovementError', () => {
    it('should mark movement as error with error message', async () => {
      const movementId = 'test-movement-id';
      const errorMessage = 'Database connection failed';

      mockQueryRunner.manager.update = jest.fn().mockResolvedValue(undefined);

      await service.markMovementError(movementId, mockQueryRunner, errorMessage);

      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        InventoryMovement,
        { id: movementId },
        {
          status: MovementStatus.ERROR,
          notes: errorMessage,
          updatedAt: expect.any(Date),
        },
      );
    });
  });

  describe('determineMovementType', () => {
    it('should return ARCHIVED for delete operations', () => {
      const result = service.determineMovementType(false, true, 1000, 1000, 10, 10);
      expect(result).toBe(MovementType.ARCHIVED);
    });

    it('should return PURCHASE for create operations', () => {
      const result = service.determineMovementType(true, false, undefined, 1000, undefined, 10);
      expect(result).toBe(MovementType.PURCHASE);
    });

    it('should return INCREASE when price increases', () => {
      const result = service.determineMovementType(false, false, 1000, 1500, 10, 10);
      expect(result).toBe(MovementType.INCREASE);
    });

    it('should return DISCOUNT when price decreases', () => {
      const result = service.determineMovementType(false, false, 1500, 1000, 10, 10);
      expect(result).toBe(MovementType.DISCOUNT);
    });

    it('should return PURCHASE when quantity increases', () => {
      const result = service.determineMovementType(false, false, 1000, 1000, 10, 15);
      expect(result).toBe(MovementType.PURCHASE);
    });

    it('should return SALE when quantity decreases', () => {
      const result = service.determineMovementType(false, false, 1000, 1000, 15, 10);
      expect(result).toBe(MovementType.SALE);
    });

    it('should prioritize price changes over quantity changes', () => {
      // Both price and quantity change, price should take priority
      const result = service.determineMovementType(false, false, 1000, 1500, 15, 10);
      expect(result).toBe(MovementType.INCREASE); // Price increase takes priority over quantity decrease
    });

    it('should return PURCHASE as default when no changes detected', () => {
      const result = service.determineMovementType(false, false, 1000, 1000, 10, 10);
      expect(result).toBe(MovementType.PURCHASE);
    });

    it('should handle undefined values correctly', () => {
      const result = service.determineMovementType(
        false,
        false,
        undefined,
        undefined,
        undefined,
        undefined,
      );
      expect(result).toBe(MovementType.PURCHASE);
    });

    it('should handle mixed undefined values', () => {
      // Price change with undefined quantity
      const result = service.determineMovementType(false, false, 1000, 1500, undefined, undefined);
      expect(result).toBe(MovementType.INCREASE);
    });

    it('should handle quantity change with undefined price', () => {
      // Quantity change with undefined price
      const result = service.determineMovementType(false, false, undefined, undefined, 10, 15);
      expect(result).toBe(MovementType.PURCHASE);
    });
  });

  describe('edge cases', () => {
    it('should handle create and delete both true (should prioritize delete)', () => {
      const result = service.determineMovementType(true, true, 1000, 1500, 10, 15);
      expect(result).toBe(MovementType.ARCHIVED);
    });

    it('should handle zero values correctly', () => {
      // Price goes from 1000 to 0 (free)
      const result = service.determineMovementType(false, false, 1000, 0, 10, 10);
      expect(result).toBe(MovementType.DISCOUNT);
    });

    it('should handle quantity going to zero', () => {
      // This case is handled in markMovementCompleted, but let's test the logic here
      const result = service.determineMovementType(false, false, 1000, 1000, 10, 0);
      expect(result).toBe(MovementType.SALE);
    });
  });
});
