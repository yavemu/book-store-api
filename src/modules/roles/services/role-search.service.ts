import { Injectable, Inject } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../interfaces';
import { IRoleSearchService } from '../interfaces';
import { IRoleSearchRepository } from '../interfaces';
import { IErrorHandlerService } from '../interfaces';
import { ERROR_MESSAGES } from '../../../common/constants/error-messages';

@Injectable()
export class RoleSearchService implements IRoleSearchService {
  constructor(
    @Inject('IRoleSearchRepository')
    private searchRepository: IRoleSearchRepository,
    @Inject('IErrorHandlerService')
    private errorHandler: IErrorHandlerService,
  ) {}

  async findByName(name: string): Promise<Role> {
    try {
      const role = await this.searchRepository.findByName(name);
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

  async findActiveRoles(pagination: PaginationDto): Promise<PaginatedResult<Role>> {
    try {
      return await this.searchRepository.findActiveRoles(pagination);
    } catch (error) {
      throw this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_GET_ALL || 'Failed to retrieve active roles',
      );
    }
  }

  async findRolesByPermission(
    permission: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<Role>> {
    try {
      return await this.searchRepository.findRolesByPermission(permission, pagination);
    } catch (error) {
      throw this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_GET_ALL || 'Failed to retrieve roles by permission',
      );
    }
  }

  async searchRoles(term: string, pagination: PaginationDto): Promise<PaginatedResult<Role>> {
    try {
      return await this.searchRepository.searchRoles(term, pagination);
    } catch (error) {
      throw this.errorHandler.handleError(
        error,
        ERROR_MESSAGES.ROLES?.FAILED_TO_GET_ALL || 'Failed to search roles',
      );
    }
  }
}
