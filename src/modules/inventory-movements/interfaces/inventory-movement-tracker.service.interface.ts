import { QueryRunner } from 'typeorm';
import { MovementType } from '../enums/movement-type.enum';
import { MovementStatus } from '../enums/movement-status.enum';

export interface MovementTrackingData {
  entityType: string;
  entityId: string;
  userId: string;
  userFullName: string;
  userRole: string;
  priceBefore?: number;
  priceAfter?: number;
  quantityBefore?: number;
  quantityAfter?: number;
  movementType: MovementType;
  notes?: string;
}

export interface IInventoryMovementTrackerService {
  /**
   * Crea un movimiento PENDING antes de realizar cambios
   */
  createPendingMovement(data: MovementTrackingData, queryRunner: QueryRunner): Promise<string>;

  /**
   * Actualiza el estado de un movimiento a COMPLETED
   */
  markMovementCompleted(
    movementId: string,
    queryRunner: QueryRunner,
    updatedValues?: Partial<MovementTrackingData>,
  ): Promise<void>;

  /**
   * Actualiza el estado de un movimiento a ERROR
   */
  markMovementError(
    movementId: string,
    queryRunner: QueryRunner,
    errorMessage: string,
  ): Promise<void>;

  /**
   * Determina el tipo de movimiento basado en cambios
   */
  determineMovementType(
    isCreate: boolean,
    isDelete: boolean,
    priceBefore?: number,
    priceAfter?: number,
    quantityBefore?: number,
    quantityAfter?: number,
  ): MovementType;
}
