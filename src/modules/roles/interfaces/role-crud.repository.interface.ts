import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';

export interface IRoleCrudRepository {
  create(createRoleDto: CreateRoleDto, performedBy?: string): Promise<Role>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<Role>>;
  findOne(id: string): Promise<Role>;
  update(id: string, updateRoleDto: UpdateRoleDto, performedBy?: string): Promise<Role>;
  remove(id: string, performedBy?: string): Promise<void>;
}