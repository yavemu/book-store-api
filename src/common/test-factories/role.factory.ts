import { DeepPartial } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';
import { BaseFactory } from './base.factory';

/**
 * Factory for creating Role entities for testing
 */
export class RoleFactory extends BaseFactory<Role> {
  create(overrides?: DeepPartial<Role>): Role {
    const now = this.generateTimestamp();
    const defaults: Role = {
      id: this.generateUuid(),
      name: 'user',
      description: 'Standard user role with basic permissions',
      isActive: true,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      users: [],
      normalizeRoleName: jest.fn(),
    };

    return this.mergeWithDefaults(defaults, overrides);
  }

  /**
   * Creates an admin role
   */
  createAdmin(overrides?: DeepPartial<Role>): Role {
    return this.create({
      name: 'admin',
      description: 'Administrator role with full permissions',
      ...overrides,
    });
  }

  /**
   * Creates a manager role
   */
  createManager(overrides?: DeepPartial<Role>): Role {
    return this.create({
      name: 'manager',
      description: 'Manager role with elevated permissions',
      ...overrides,
    });
  }

  /**
   * Creates a user role
   */
  createUser(overrides?: DeepPartial<Role>): Role {
    return this.create({
      name: 'user',
      description: 'Standard user role with basic permissions',
      ...overrides,
    });
  }

  /**
   * Creates an inactive role
   */
  createInactive(overrides?: DeepPartial<Role>): Role {
    return this.create({
      name: 'inactive_role',
      description: 'Inactive role for testing',
      isActive: false,
      ...overrides,
    });
  }
}
