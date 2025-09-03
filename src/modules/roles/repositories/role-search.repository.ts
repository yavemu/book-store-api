import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { Role } from '../entities/role.entity';
import { IRoleSearchRepository } from '../interfaces';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { IAuditLoggerService } from '../interfaces';
import { ROLE_ERROR_MESSAGES } from '../enums/error-messages.enum';

@Injectable()
export class RoleSearchRepository extends BaseRepository<Role> implements IRoleSearchRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService: IAuditLoggerService,
  ) {
    super(roleRepository, auditLogService);
  }

  async findByName(name: string): Promise<Role> {
    try {
      return await this._findByField('name', name);
    } catch (error) {
      throw new HttpException(
        ROLE_ERROR_MESSAGES.FAILED_TO_FIND_BY_NAME,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findActiveRoles(pagination: PaginationDto): Promise<PaginatedResult<Role>> {
    try {
      const options: FindManyOptions<Role> = {
        where: { isActive: true },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException(
        ROLE_ERROR_MESSAGES.FAILED_TO_FIND_ACTIVE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRolesByPermission(
    permission: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Role>> {
    try {
      const options: FindManyOptions<Role> = {
        where: { description: ILike(`%${permission}%`) },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException(
        ROLE_ERROR_MESSAGES.FAILED_TO_FIND_BY_PERMISSION,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchRoles(term: string, pagination: PaginationDto): Promise<PaginatedResult<Role>> {
    try {
      const options: FindManyOptions<Role> = {
        where: [{ name: ILike(`%${term}%`) }, { description: ILike(`%${term}%`) }],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException(
        ROLE_ERROR_MESSAGES.FAILED_TO_SEARCH,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
