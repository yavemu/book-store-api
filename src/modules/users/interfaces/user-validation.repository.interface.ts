import { User } from '../entities/user.entity';

export interface IUserValidationRepository {
  findByEmail(email: string): Promise<User>;
  findByEmailExcludingId(email: string, excludeId: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByUsernameExcludingId(username: string, excludeId: string): Promise<User>;
  _validateUniqueConstraints(
    dto: Partial<User>,
    entityId?: string,
    constraints?: any[],
  ): Promise<void>;
}
