import { User, UserRole } from '../../modules/users/entities/user.entity';

export class UserMockFactory {
  // Mock para 1 resultado
  static createOne(overrides?: Partial<User>): User {
    const user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123',
      role: UserRole.USER,
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-02T00:00:00.000Z'),
      deletedAt: undefined,
      ...overrides,
    } as User;

    // Add entity methods as empty functions for mocking
    user.hashPassword = async () => {};
    user.normalizeEmail = () => {};
    user.normalizeUsername = () => {};

    return user;
  }

  // Mock para múltiples resultados
  static createMany(count: number = 2, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.createOne(overrides));
  }

  // Mock sin relaciones
  static createWithoutRelations(overrides?: Partial<User>): User {
    const user = this.createOne(overrides);
    return user;
  }

  // Mock para admin
  static createAdmin(overrides?: Partial<User>): User {
    return this.createOne({
      role: UserRole.ADMIN,
      username: 'admin',
      email: 'admin@test.com',
      ...overrides,
    });
  }

  // Mock para usuario regular
  static createRegularUser(overrides?: Partial<User>): User {
    return this.createOne({
      role: UserRole.USER,
      ...overrides,
    });
  }

  // Mock para usuario eliminado
  static createDeletedUser(overrides?: Partial<User>): User {
    return this.createOne({
      deletedAt: new Date('2023-01-03T00:00:00.000Z'),
      ...overrides,
    });
  }
}

// Datos predefinidos para tests
export const userMockData = {
  singleUser: UserMockFactory.createOne(),
  multipleUsers: UserMockFactory.createMany(3),
  adminUser: UserMockFactory.createAdmin(),
  regularUser: UserMockFactory.createRegularUser(),
  deletedUser: UserMockFactory.createDeletedUser(),
};