import { DeepPartial } from 'typeorm';
import { InventoryMovement } from '../../modules/inventory-movements/entities/inventory-movement.entity';
import { MovementType } from '../../modules/inventory-movements/enums/movement-type.enum';
import { MovementStatus } from '../../modules/inventory-movements/enums/movement-status.enum';
import { BaseFactory } from './base.factory';
import { UserFactory } from './user.factory';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * Factory for creating InventoryMovement entities for testing
 */
export class InventoryMovementFactory extends BaseFactory<InventoryMovement> {
  private userFactory = new UserFactory();

  create(overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    const now = this.generateTimestamp();
    const user = this.userFactory.create();

    const defaults = {
      id: this.generateUuid(),
      entityType: 'book',
      entityId: this.generateUuid(),
      userId: user.id,
      userFullName: `${user.firstName} ${user.lastName}`,
      userRole: 'user',
      priceBefore: 25.0,
      priceAfter: 27.5,
      quantityBefore: 50,
      quantityAfter: 45,
      movementType: MovementType.SALE,
      status: MovementStatus.COMPLETED,
      notes: 'Test inventory movement',
      user: user,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      beforeInsert: jest.fn(),
      beforeUpdate: jest.fn(),
    };

    return this.mergeWithDefaults(defaults as unknown as InventoryMovement, overrides);
  }

  /**
   * Creates a PURCHASE movement
   */
  createPurchase(overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    return this.create({
      movementType: MovementType.PURCHASE,
      quantityBefore: 10,
      quantityAfter: 35,
      notes: 'Stock replenishment purchase',
      ...overrides,
    });
  }

  /**
   * Creates a SALE movement
   */
  createSale(overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    return this.create({
      movementType: MovementType.SALE,
      quantityBefore: 50,
      quantityAfter: 45,
      notes: 'Book sold to customer',
      ...overrides,
    });
  }

  /**
   * Creates a DISCOUNT movement
   */
  createDiscount(overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    return this.create({
      movementType: MovementType.DISCOUNT,
      priceBefore: 30.0,
      priceAfter: 25.0,
      notes: 'Price discount applied',
      ...overrides,
    });
  }

  /**
   * Creates an INCREASE movement
   */
  createIncrease(overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    return this.create({
      movementType: MovementType.INCREASE,
      priceBefore: 25.0,
      priceAfter: 30.0,
      notes: 'Price increase applied',
      ...overrides,
    });
  }

  /**
   * Creates an OUT_OF_STOCK movement
   */
  createOutOfStock(overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    return this.create({
      movementType: MovementType.OUT_OF_STOCK,
      quantityBefore: 5,
      quantityAfter: 0,
      notes: 'Item went out of stock',
      ...overrides,
    });
  }

  /**
   * Creates an ARCHIVED movement
   */
  createArchived(overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    return this.create({
      movementType: MovementType.ARCHIVED,
      isActive: false,
      notes: 'Item has been archived',
      ...overrides,
    });
  }

  /**
   * Creates a PENDING movement
   */
  createPending(overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    return this.create({
      status: MovementStatus.PENDING,
      notes: 'Movement is pending processing',
      ...overrides,
    });
  }

  /**
   * Creates an ERROR movement
   */
  createError(errorMessage: string, overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    return this.create({
      status: MovementStatus.ERROR,
      notes: `Error occurred: ${errorMessage}`,
      ...overrides,
    });
  }

  /**
   * Creates a movement for a specific user
   */
  createForUser(
    userId: string,
    userFullName: string,
    userRole: string,
    overrides?: DeepPartial<InventoryMovement>,
  ): InventoryMovement {
    return this.create({
      userId,
      userFullName,
      userRole,
      ...overrides,
    });
  }

  /**
   * Creates a movement for a specific entity
   */
  createForEntity(
    entityType: string,
    entityId: string,
    overrides?: DeepPartial<InventoryMovement>,
  ): InventoryMovement {
    return this.create({
      entityType,
      entityId,
      ...overrides,
    });
  }

  /**
   * Creates an admin-initiated movement
   */
  createAdminMovement(overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    const adminUser = this.userFactory.createAdmin();
    return this.create({
      userId: adminUser.id,
      userFullName: `${adminUser.firstName} ${adminUser.lastName}`,
      userRole: 'admin',
      user: adminUser,
      notes: 'Movement initiated by admin',
      ...overrides,
    });
  }

  /**
   * Creates a movement with specific price and quantity changes
   */
  createWithChanges(
    priceBefore: number,
    priceAfter: number,
    quantityBefore: number,
    quantityAfter: number,
    overrides?: DeepPartial<InventoryMovement>,
  ): InventoryMovement {
    return this.create({
      priceBefore,
      priceAfter,
      quantityBefore,
      quantityAfter,
      ...overrides,
    });
  }

  /**
   * Creates an inactive movement
   */
  createInactive(overrides?: DeepPartial<InventoryMovement>): InventoryMovement {
    return this.create({
      isActive: false,
      notes: 'Inactive movement for testing',
      ...overrides,
    });
  }
}
