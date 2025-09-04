import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { IRoleCrudRepository, IRoleSearchRepository } from '../interfaces';
import { Role } from '../entities/role.entity';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../common/constants';
import {
  CreateRoleRequestDto,
  GetAllRolesDto,
  GetRoleByIdDto,
  UpdateRoleRequestDto,
  DeleteRoleRequestDto,
  SearchRolesRequestDto,
} from '../dto';
// Internal interfaces for service processing (following standards: services use interfaces, not DTOs)
interface ICreateRoleData {
  name: string;
  description?: string;
}

interface ICreateRoleRequest {
  roleData: ICreateRoleData;
}

interface IRoleProfile {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IRoleResponse {
  data: IRoleProfile;
  message: string;
}

interface IRolesListResponse {
  data: IRoleProfile[];
  meta?: any;
  message: string;
}

interface IDeleteRoleResponse {
  data: { id: string };
  message: string;
}

@Injectable()
export class RoleService {
  constructor(
    @Inject('IRoleCrudRepository')
    private readonly roleCrudRepository: IRoleCrudRepository,
    @Inject('IRoleSearchRepository')
    private readonly roleSearchRepository: IRoleSearchRepository,
  ) {}

  // PUBLIC CRUD METHODS - Always receive (dto, req)
  async createRole(requestDto: CreateRoleRequestDto, req: ExpressRequest): Promise<IRoleResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      // Convert DTO to internal interface
      const createRoleRequest: ICreateRoleRequest = {
        roleData: {
          name: requestDto.roleData.name,
          description: requestDto.roleData.description,
        },
      };

      // Validar que el nombre del rol no existe
      await this.validateUniqueRoleName(createRoleRequest.roleData.name);

      const role = await this.roleCrudRepository.createRole({
        createRoleDto: createRoleRequest.roleData,
        performedBy: currentUserId,
      });

      return {
        data: this.buildRoleProfile(role),
        message: SUCCESS_MESSAGES.ROLES.CREATE_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllRoles(requestDto: GetAllRolesDto, req: ExpressRequest): Promise<IRolesListResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      const result = await this.roleCrudRepository.getAllRoles({
        pagination: requestDto.pagination,
        performedBy: currentUserId,
      });

      return {
        data: result.data.map((role) => this.buildRoleProfile(role)),
        meta: result.meta,
        message: SUCCESS_MESSAGES.ROLES.FETCH_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findRoleById(requestDto: GetRoleByIdDto, req: ExpressRequest): Promise<IRoleResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      const role = await this.roleCrudRepository.getRoleById({
        id: requestDto.id,
        performedBy: currentUserId,
      });

      if (!role) {
        throw new NotFoundException(ERROR_MESSAGES.ROLES.NOT_FOUND);
      }

      return {
        data: this.buildRoleProfile(role),
        message: SUCCESS_MESSAGES.ROLES.FETCH_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateRole(requestDto: UpdateRoleRequestDto, req: ExpressRequest): Promise<IRoleResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      // Validar que el rol existe
      await this.validateRoleExists(requestDto.id);

      // Si se está actualizando el nombre, validar que no existe otro rol con ese nombre
      if (requestDto.updateData.name) {
        await this.validateUniqueRoleName(requestDto.updateData.name, requestDto.id);
      }

      const role = await this.roleCrudRepository.updateRole({
        id: requestDto.id,
        updateRoleDto: requestDto.updateData,
        performedBy: currentUserId,
      });

      return {
        data: this.buildRoleProfile(role),
        message: SUCCESS_MESSAGES.ROLES.UPDATE_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteRole(
    requestDto: DeleteRoleRequestDto,
    req: ExpressRequest,
  ): Promise<IDeleteRoleResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      // Validar que el rol existe
      await this.validateRoleExists(requestDto.id);

      await this.roleCrudRepository.softDeleteRole({
        id: requestDto.id,
        performedBy: currentUserId,
      });

      return {
        data: { id: requestDto.id },
        message: SUCCESS_MESSAGES.ROLES.DELETE_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  // PUBLIC SEARCH METHODS - Always receive (dto, req)
  async searchRoles(
    requestDto: SearchRolesRequestDto,
    req: ExpressRequest,
  ): Promise<IRolesListResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      const result = await this.roleSearchRepository.searchRoles({
        searchTerm: requestDto.searchTerm,
        pagination: requestDto.pagination,
        performedBy: currentUserId,
      });

      return {
        data: result.data.map((role) => this.buildRoleProfile(role)),
        meta: result.meta,
        message: SUCCESS_MESSAGES.ROLES.SEARCH_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findActiveRoles(
    requestDto: GetAllRolesDto,
    req: ExpressRequest,
  ): Promise<IRolesListResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      const result = await this.roleSearchRepository.findActiveRoles({
        pagination: requestDto.pagination,
        performedBy: currentUserId,
      });

      return {
        data: result.data.map((role) => this.buildRoleProfile(role)),
        meta: result.meta,
        message: SUCCESS_MESSAGES.ROLES.FETCH_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findRolesByPermission(
    permission: string,
    requestDto: GetAllRolesDto,
    req: ExpressRequest,
  ): Promise<IRolesListResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      const result = await this.roleSearchRepository.findRolesByPermission({
        permission,
        pagination: requestDto.pagination,
        performedBy: currentUserId,
      });

      return {
        data: result.data.map((role) => this.buildRoleProfile(role)),
        meta: result.meta,
        message: SUCCESS_MESSAGES.ROLES.FETCH_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  // PUBLIC SPECIAL METHODS - Auth service integration
  async findByName(name: string): Promise<Role | null> {
    return await this.roleSearchRepository.findByName(name);
  }

  // PRIVATE HELPER METHODS - Internal logic
  private buildRoleProfile(role: Role): IRoleProfile {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  private async validateUniqueRoleName(name: string, excludeId?: string): Promise<void> {
    const existingRole = await this.roleCrudRepository.findByName(name);
    if (existingRole && existingRole.id !== excludeId) {
      throw new ConflictException(ERROR_MESSAGES.ROLES.NAME_ALREADY_EXISTS);
    }
  }

  private async validateRoleExists(id: string): Promise<void> {
    const role = await this.roleCrudRepository.findById(id);
    if (!role) {
      throw new NotFoundException(ERROR_MESSAGES.ROLES.NOT_FOUND);
    }
  }
}
