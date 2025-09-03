import { Injectable, Inject } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../interfaces';
import { IRoleCrudService } from '../interfaces';
import { IRoleCrudRepository } from '../interfaces';
import { IValidationService } from '../interfaces';
import { IErrorHandlerService } from '../interfaces';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

const UNIQUE_CONSTRAINTS = [
  {
    field: 'name',
    message: ERROR_MESSAGES.ROLES?.ALREADY_EXISTS || 'Role name already exists',
    transform: (value: string) => value.toLowerCase().trim(),
  },
];

@Injectable()
export class RoleCrudService implements IRoleCrudService {
  constructor(
    @Inject('IRoleCrudRepository')
    private crudRepository: IRoleCrudRepository,
    @Inject('IValidationService')
    private validationService: IValidationService,
    @Inject('IErrorHandlerService')
    private errorHandler: IErrorHandlerService,
  ) {}

  async create(createRoleDto: CreateRoleDto, performedBy?: string): Promise<Role> {
    try {
      await this.validationService.validateUniqueConstraints(
        createRoleDto,
        undefined,
        UNIQUE_CONSTRAINTS,
        this.crudRepository,
      );

      return await this.crudRepository.create(createRoleDto, performedBy);
    } catch (error) {
      throw this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_CREATE || 'Failed to create role',
      );
    }
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Role>> {
    try {
      return await this.crudRepository.findAll(pagination);
    } catch (error) {
      throw this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_GET_ALL || 'Failed to retrieve roles',
      );
    }
  }

  async findOne(id: string): Promise<Role> {
    try {
      const role = await this.crudRepository.findOne(id);
      if (!role) {
        throw this.errorHandler.createNotFoundException(
          ERROR_MESSAGES.ROLES?.NOT_FOUND || 'Role not found',
        );
      }
      return role;
    } catch (error) {
      throw this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_GET_ALL || 'Failed to retrieve role',
      );
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, performedBy?: string): Promise<Role> {
    try {
      await this.findOne(id);
      await this.validationService.validateUniqueConstraints(
        updateRoleDto,
        id,
        UNIQUE_CONSTRAINTS,
        this.crudRepository,
      );

      return await this.crudRepository.update(id, updateRoleDto, performedBy);
    } catch (error) {
      throw this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_UPDATE || 'Failed to update role',
      );
    }
  }

  async remove(id: string, performedBy?: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.crudRepository.remove(id, performedBy);
    } catch (error) {
      throw this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_DELETE || 'Failed to delete role',
      );
    }
  }
}
