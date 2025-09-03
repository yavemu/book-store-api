import { Injectable } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { MovementType } from '../enums/movement-type.enum';
import { MovementStatus } from '../enums/movement-status.enum';
import {
  IInventoryMovementTrackerService,
  MovementTrackingData,
} from '../interfaces';

@Injectable()
export class InventoryMovementTrackerService implements IInventoryMovementTrackerService {
  async createPendingMovement(
    data: MovementTrackingData,
    queryRunner: QueryRunner,
  ): Promise<string> {
    const movement = new InventoryMovement();
    movement.entityType = data.entityType;
    movement.entityId = data.entityId;
    movement.userId = data.userId;
    movement.userFullName = data.userFullName;
    movement.userRole = data.userRole;
    movement.priceBefore = data.priceBefore;
    movement.priceAfter = data.priceAfter;
    movement.quantityBefore = data.quantityBefore;
    movement.quantityAfter = data.quantityAfter;
    movement.movementType = data.movementType;
    movement.status = MovementStatus.PENDING;
    movement.notes = data.notes;
    movement.isActive = true;

    const savedMovement = await queryRunner.manager.save(InventoryMovement, movement);
    return savedMovement.id;
  }

  async markMovementCompleted(
    movementId: string,
    queryRunner: QueryRunner,
    updatedValues?: Partial<MovementTrackingData>,
  ): Promise<void> {
    const updateData: any = {
      status: MovementStatus.COMPLETED,
      updatedAt: new Date(),
    };

    if (updatedValues) {
      if (updatedValues.priceAfter !== undefined) {
        updateData.priceAfter = updatedValues.priceAfter;
      }
      if (updatedValues.quantityAfter !== undefined) {
        updateData.quantityAfter = updatedValues.quantityAfter;

        // Si la cantidad después es 0, cambiar el tipo a OUT_OF_STOCK
        if (updatedValues.quantityAfter === 0) {
          updateData.movementType = MovementType.OUT_OF_STOCK;
        }
      }
      if (updatedValues.movementType) {
        updateData.movementType = updatedValues.movementType;
      }
    }

    await queryRunner.manager.update(InventoryMovement, { id: movementId }, updateData);
  }

  async markMovementError(
    movementId: string,
    queryRunner: QueryRunner,
    errorMessage: string,
  ): Promise<void> {
    await queryRunner.manager.update(
      InventoryMovement,
      { id: movementId },
      {
        status: MovementStatus.ERROR,
        notes: errorMessage,
        updatedAt: new Date(),
      },
    );
  }

  determineMovementType(
    isCreate: boolean,
    isDelete: boolean,
    priceBefore?: number,
    priceAfter?: number,
    quantityBefore?: number,
    quantityAfter?: number,
  ): MovementType {
    // Si es eliminación
    if (isDelete) {
      return MovementType.ARCHIVED;
    }

    // Si es creación
    if (isCreate) {
      return MovementType.PURCHASE;
    }

    // Si hay cambio de precio
    if (priceBefore !== undefined && priceAfter !== undefined && priceBefore !== priceAfter) {
      return priceAfter > priceBefore ? MovementType.INCREASE : MovementType.DISCOUNT;
    }

    // Si hay cambio de cantidad
    if (
      quantityBefore !== undefined &&
      quantityAfter !== undefined &&
      quantityBefore !== quantityAfter
    ) {
      // Si la cantidad aumenta, es compra; si disminuye, es venta
      return quantityAfter > quantityBefore ? MovementType.PURCHASE : MovementType.SALE;
    }

    // Valor por defecto (no debería llegar aquí)
    return MovementType.PURCHASE;
  }
}
