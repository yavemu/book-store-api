import { Role } from '../entities/role.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export interface IRoleSearchRepository {
  findByName(name: string): Promise<Role>;
  findActiveRoles(pagination: PaginationDto): Promise<PaginatedResult<Role>>;
  findRolesByPermission(
    permission: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Role>>;
  searchRoles(term: string, pagination: PaginationDto): Promise<PaginatedResult<Role>>;
}
