import { User } from '../../modules/users/entities/user.entity';
import { Role } from '../../modules/roles/entities/role.entity';
import { UserRole } from '../enums/user-role.enum';

export class UserMockFactory {
  private static createRole(name: string): Role {
    return {
      id: '1',
      name,
      description: `${name} role`,
      isActive: true,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      normalizeRoleName: () => {},
    } as Role;
  }

  static createOne(overrides?: Partial<User>): User {
    const user = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword123',
      role: this.createRole(UserRole.USER),
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-02T00:00:00.000Z'),
      deletedAt: undefined,
      ...overrides,
    } as User;

    user.hashPassword = async () => {};
    user.normalizeEmail = () => {};
    user.normalizeUsername = () => {};

    return user;
  }

  static createMany(count: number = 2, overrides?: Partial<User>): User[] {
    return Array.from({ length: count }, () => this.createOne(overrides));
  }

  static createWithoutRelations(overrides?: Partial<User>): User {
    const user = this.createOne(overrides);
    return user;
  }

  static createAdmin(overrides?: Partial<User>): User {
    return this.createOne({
      role: this.createRole(UserRole.ADMIN),
      username: 'admin',
      email: 'admin@test.com',
      ...overrides,
    });
  }

  static createRegularUser(overrides?: Partial<User>): User {
    return this.createOne({
      role: this.createRole(UserRole.USER),
      ...overrides,
    });
  }

  static createDeletedUser(overrides?: Partial<User>): User {
    return this.createOne({
      deletedAt: new Date('2023-01-03T00:00:00.000Z'),
      ...overrides,
    });
  }
}

export const userMockData = {
  singleUser: UserMockFactory.createOne(),
  multipleUsers: UserMockFactory.createMany(3),
  adminUser: UserMockFactory.createAdmin(),
  regularUser: UserMockFactory.createRegularUser(),
  deletedUser: UserMockFactory.createDeletedUser(),
};
