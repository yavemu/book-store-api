import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export interface IRoleRepository {
  createRole(createRoleDto: CreateRoleDto): Promise<Role>;
  getAllRoles(pagination: PaginationDto): Promise<PaginatedResult<Role>>;
  getRoleById(id: string): Promise<Role>;
  getRoleByName(name: string): Promise<Role>;
  updateRole(id: string, updateRoleDto: UpdateRoleDto): Promise<Role>;
  deleteRole(id: string): Promise<void>;
  getActiveRoles(pagination: PaginationDto): Promise<PaginatedResult<Role>>;
  getRolesByPermission(permission: string, pagination: PaginationDto): Promise<PaginatedResult<Role>>;
}