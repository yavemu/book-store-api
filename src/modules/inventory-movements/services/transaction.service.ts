import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { BookCatalog } from '../../book-catalog/entities/book-catalog.entity';
import { MovementStatus } from '../enums/movement-status.enum';
import { MovementType } from '../enums/movement-type.enum';

export interface InventoryTransactionData {
  entityId: string;
  entityType: string;
  userId: string;
  userFullName: string;
  userRole: string;
  movementType: MovementType;
  quantityBefore: number;
  quantityAfter: number;
  priceBefore?: number;
  priceAfter?: number;
  notes?: string;
}

@Injectable()
export class InventoryTransactionService {
  constructor(private dataSource: DataSource) {}

  /**
   * Execute inventory movement with ACID transaction
   * Ensures consistency between inventory_movements and book_catalog tables
   */
  async executeInventoryTransaction(
    transactionData: InventoryTransactionData,
  ): Promise<InventoryMovement> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      // 1. Lock the book record for update (prevents race conditions)
      const book = await queryRunner.manager.findOne(BookCatalog, {
        where: { id: transactionData.entityId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!book) {
        throw new Error(`Entity with ID ${transactionData.entityId} not found`);
      }

      // 2. Validate quantity consistency
      if (book.stockQuantity !== transactionData.quantityBefore) {
        throw new Error(
          `Stock quantity mismatch. Expected: ${transactionData.quantityBefore}, Actual: ${book.stockQuantity}`,
        );
      }

      // 3. Validate business rules
      if (transactionData.quantityAfter < 0) {
        throw new Error('Stock quantity cannot be negative');
      }

      // 4. Create inventory movement record
      const inventoryMovement = queryRunner.manager.create(InventoryMovement, {
        ...transactionData,
        status: MovementStatus.PENDING,
        isActive: true,
      });

      const savedMovement = await queryRunner.manager.save(inventoryMovement);

      // 5. Update book stock quantity
      await queryRunner.manager.update(
        BookCatalog,
        { id: transactionData.entityId },
        {
          stockQuantity: transactionData.quantityAfter,
          ...(transactionData.priceAfter && { price: transactionData.priceAfter }),
          updatedAt: new Date(),
        },
      );

      // 6. Update movement status to COMPLETED
      await queryRunner.manager.update(
        InventoryMovement,
        { id: savedMovement.id },
        { status: MovementStatus.COMPLETED },
      );

      // Commit transaction
      await queryRunner.commitTransaction();

      return savedMovement;
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();

      // Create error record if movement was created
      try {
        const errorMovement = queryRunner.manager.create(InventoryMovement, {
          ...transactionData,
          status: MovementStatus.ERROR,
          notes: `Transaction failed: ${error.message}`,
          isActive: true,
        });
        await queryRunner.manager.save(errorMovement);
      } catch (logError) {
        // If we can't log the error, at least throw the original error
        console.error('Failed to log inventory transaction error:', logError);
      }

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Execute multiple inventory movements in a single transaction
   * For bulk operations that need to maintain consistency
   */
  async executeBulkInventoryTransaction(
    transactionDataArray: InventoryTransactionData[],
  ): Promise<InventoryMovement[]> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const results: InventoryMovement[] = [];

      for (const transactionData of transactionDataArray) {
        // Lock and validate each book
        const book = await queryRunner.manager.findOne(BookCatalog, {
          where: { id: transactionData.entityId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!book) {
          throw new Error(`Entity with ID ${transactionData.entityId} not found`);
        }

        if (book.stockQuantity !== transactionData.quantityBefore) {
          throw new Error(
            `Stock quantity mismatch for book ${transactionData.entityId}. Expected: ${transactionData.quantityBefore}, Actual: ${book.stockQuantity}`,
          );
        }

        if (transactionData.quantityAfter < 0) {
          throw new Error(`Negative stock not allowed for book ${transactionData.entityId}`);
        }

        // Create movement
        const inventoryMovement = queryRunner.manager.create(InventoryMovement, {
          ...transactionData,
          status: MovementStatus.PENDING,
          isActive: true,
        });

        const savedMovement = await queryRunner.manager.save(inventoryMovement);
        results.push(savedMovement);

        // Update book
        await queryRunner.manager.update(
          BookCatalog,
          { id: transactionData.entityId },
          {
            stockQuantity: transactionData.quantityAfter,
            ...(transactionData.priceAfter && { price: transactionData.priceAfter }),
            updatedAt: new Date(),
          },
        );

        // Update movement status
        await queryRunner.manager.update(
          InventoryMovement,
          { id: savedMovement.id },
          { status: MovementStatus.COMPLETED },
        );
      }

      await queryRunner.commitTransaction();
      return results;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
