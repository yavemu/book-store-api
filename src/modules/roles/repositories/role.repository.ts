import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { Role } from '../entities/role.entity';
import { IRoleCrudRepository } from '../interfaces/role-crud.repository.interface';
import { IRoleSearchRepository } from '../interfaces/role-search.repository.interface';
import { IRoleValidationRepository } from '../interfaces/role-validation.repository.interface';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { IAuditLoggerService } from '../../audit/interfaces/audit-logger.service.interface';

@Injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleCrudRepository, IRoleSearchRepository, IRoleValidationRepository
{
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService: IAuditLoggerService,
  ) {
    super(roleRepository, auditLogService);
  }

  async create(createRoleDto: CreateRoleDto, performedBy?: string): Promise<Role> {
    return await this._create(
      createRoleDto,
      performedBy || 'system',
      'Role',
      (role) => `Role created: ${role.name}`,
    );
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Role>> {
    const options: FindManyOptions<Role> = {
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };

    return await this._findManyWithPagination(options, pagination);
  }

  async findOne(id: string): Promise<Role> {
    return await this._findById(id);
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, performedBy?: string): Promise<Role> {
    return await this._update(
      id,
      updateRoleDto,
      performedBy || 'system',
      'Role',
      (role) => `Role ${role.id} updated.`,
    );
  }

  async remove(id: string, performedBy?: string): Promise<void> {
    await this._softDelete(
      id,
      performedBy || 'system',
      'Role',
      (role) => `Role ${role.id} deactivated.`,
    );
  }

  async findByName(name: string): Promise<Role> {
    return await this._findOne({
      where: {
        name: name.toLowerCase().trim(),
      },
    });
  }

  async findByNameExcludingId(name: string, excludeId: string): Promise<Role> {
    return await this._findOne({
      where: {
        name: name.toLowerCase().trim(),
        id: { not: excludeId } as any,
      },
    });
  }

  async findActiveRoles(pagination: PaginationDto): Promise<PaginatedResult<Role>> {
    const options: FindManyOptions<Role> = {
      where: { isActive: true },
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };

    return await this._findManyWithPagination(options, pagination);
  }

  async findRolesByPermission(
    permission: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Role>> {
    const options: FindManyOptions<Role> = {
      where: { description: ILike(`%${permission}%`) },
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };

    return await this._findManyWithPagination(options, pagination);
  }

  async searchRoles(term: string, pagination: PaginationDto): Promise<PaginatedResult<Role>> {
    const options: FindManyOptions<Role> = {
      where: [{ name: ILike(`%${term}%`) }, { description: ILike(`%${term}%`) }],
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    };

    return await this._findManyWithPagination(options, pagination);
  }

  async _validateUniqueConstraints(
    dto: Partial<Role>,
    entityId?: string,
    constraints?: any[],
  ): Promise<void> {
    if (!constraints) return;

    for (const constraint of constraints) {
      const fieldValue = dto[constraint.field];
      if (!fieldValue) continue;

      const transformedValue = constraint.transform ? constraint.transform(fieldValue) : fieldValue;

      let existingEntity: Role;
      if (entityId) {
        existingEntity = await this.findByNameExcludingId(transformedValue, entityId);
      } else {
        existingEntity = await this.findByName(transformedValue);
      }

      if (existingEntity) {
        throw new Error(constraint.message);
      }
    }
  }
}
