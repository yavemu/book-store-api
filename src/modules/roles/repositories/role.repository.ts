import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Role } from '../entities/role.entity';
import { IRoleCrudRepository } from '../interfaces';
import { IRoleValidationRepository } from '../interfaces';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../interfaces';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { IAuditLoggerService } from '../interfaces';

@Injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleCrudRepository, IRoleValidationRepository
{
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService: IAuditLoggerService,
  ) {
    super(roleRepository, auditLogService);
  }

  async createRole(createRoleDto: CreateRoleDto, performedBy?: string): Promise<Role> {
    return await this._create(
      createRoleDto,
      performedBy || 'system',
      'Role',
      (role) => `Role created: ${role.name}`,
    );
  }

  async getAllRoles(pagination: PaginationDto): Promise<PaginatedResult<Role>> {
    const options: FindManyOptions<Role> = {
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };

    return await this._findManyWithPagination(options, pagination);
  }

  async getRoleById(id: string): Promise<Role> {
    return await this._findById(id);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto, performedBy?: string): Promise<Role> {
    return await this._update(
      id,
      updateRoleDto,
      performedBy || 'system',
      'Role',
      (role) => `Role ${role.id} updated.`,
    );
  }

  async deleteRole(id: string, performedBy?: string): Promise<void> {
    await this._softDelete(
      id,
      performedBy || 'system',
      'Role',
      (role) => `Role ${role.id} deactivated.`,
    );
  }

  async findByName(name: string): Promise<Role> {
    return await this._findByField('name', name);
  }

  async findByNameExcludingId(name: string, excludeId: string): Promise<Role> {
    return await this._findByField('name', name, { excludeId });
  }
}
