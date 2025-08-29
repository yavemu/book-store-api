import { Role } from '../entities/role.entity';

export interface IRoleValidationRepository {
  findByName(name: string): Promise<Role>;
  findByNameExcludingId(name: string, excludeId: string): Promise<Role>;
  _validateUniqueConstraints(dto: Partial<Role>, entityId?: string, constraints?: any[]): Promise<void>;
}