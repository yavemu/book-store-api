import { DeepPartial } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import { BaseFactory } from './base.factory';
import { RoleFactory } from './role.factory';

/**
 * Factory for creating User entities for testing
 */
export class UserFactory extends BaseFactory<User> {
  private roleFactory = new RoleFactory();

  create(overrides?: DeepPartial<User>): User {
    const now = this.generateTimestamp();
    const defaults: User = {
      id: this.generateUuid(),
      username: `testuser${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: '$2b$10$hashedPasswordForTesting',
      firstName: 'John',
      lastName: 'Doe',
      roleId: this.generateUuid(),
      role: this.roleFactory.create(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      hashPassword: jest.fn(),
      normalizeEmail: jest.fn(),
      normalizeUsername: jest.fn(),
    };

    return this.mergeWithDefaults(defaults, overrides);
  }

  /**
   * Creates a user with a specific role
   */
  createWithRole(roleName: string, overrides?: DeepPartial<User>): User {
    const role = this.roleFactory.create({ name: roleName });
    return this.create({
      roleId: role.id,
      role: role,
      ...overrides,
    });
  }

  /**
   * Creates an admin user
   */
  createAdmin(overrides?: DeepPartial<User>): User {
    return this.createWithRole('admin', {
      username: 'admin',
      email: 'admin@example.com',
      ...overrides,
    });
  }

  /**
   * Creates a regular user
   */
  createUser(overrides?: DeepPartial<User>): User {
    return this.createWithRole('user', overrides);
  }

  /**
   * Creates a user without password hashing (for testing purposes)
   */
  createWithPlainPassword(password: string = 'plainPassword', overrides?: DeepPartial<User>): User {
    return this.create({
      password,
      ...overrides,
    });
  }
}
