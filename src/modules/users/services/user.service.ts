import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request as ExpressRequest } from 'express';
import { IUserCrudRepository, IUserSearchRepository } from '../interfaces';
import { User } from '../entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../common/constants';
import {
  CreateUserRequestDto,
  GetAllUsersDto,
  GetUserByIdDto,
  GetUsersBySearchDto,
  GetUsersByFilterDto,
  GetUsersByAdvancedFilterDto,
  UpdateUserRequestDto,
  DeleteUserRequestDto,
  ExportUsersCsvRequestDto,
} from '../dto';
// Internal interfaces for service processing (following standards: services use interfaces, not DTOs)
interface ICreateUserData {
  username: string;
  email: string;
  password: string;
  roleId?: string;
}

interface ICreateUserRequest {
  userData: ICreateUserData;
}

interface IUserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserResponse {
  data: IUserProfile;
  message: string;
}

interface IUsersListResponse {
  data: IUserProfile[];
  meta?: any;
  message: string;
}

interface IDeleteUserResponse {
  data: { id: string };
  message: string;
}

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserCrudRepository')
    private readonly userCrudRepository: IUserCrudRepository,
    @Inject('IUserSearchRepository')
    private readonly userSearchRepository: IUserSearchRepository,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // PUBLIC CRUD METHODS - Always receive (dto, req)
  async createUser(requestDto: CreateUserRequestDto, req: ExpressRequest): Promise<IUserResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      // Convert DTO to internal interface
      const createUserRequest: ICreateUserRequest = {
        userData: {
          username: requestDto.userData.username,
          email: requestDto.userData.email,
          password: requestDto.userData.password,
          roleId: requestDto.userData.roleId,
        },
      };

      // Validar restricciones únicas
      await this.validateUniqueConstraints(createUserRequest.userData);

      // Asignar rol por defecto si no se proporciona
      if (!createUserRequest.userData.roleId) {
        const defaultRole = await this.getDefaultRole();
        createUserRequest.userData.roleId = defaultRole.id;
      }

      const user = await this.userCrudRepository.createUser({
        createUserDto: createUserRequest.userData,
        performedBy: currentUserId,
      });

      return {
        data: this.buildUserProfile(user),
        message: SUCCESS_MESSAGES.USERS.CREATE_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllUsers(requestDto: GetAllUsersDto, req: ExpressRequest): Promise<IUsersListResponse> {
    try {
      const currentUserId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      const result = await this.userCrudRepository.getAllUsers({
        pagination: requestDto.pagination,
        performedBy: currentUserId,
        userRole,
      });

      return {
        data: result.data.map((user) => this.buildUserProfile(user)),
        meta: result.meta,
        message: SUCCESS_MESSAGES.USERS.FETCH_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findUserById(requestDto: GetUserByIdDto, req: ExpressRequest): Promise<IUserResponse> {
    try {
      const currentUserId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      const user = await this.userCrudRepository.getUserById({
        id: requestDto.id,
        performedBy: currentUserId,
        userRole,
      });

      if (!user) {
        throw new NotFoundException(ERROR_MESSAGES.USERS.NOT_FOUND);
      }

      return {
        data: this.buildUserProfile(user),
        message: SUCCESS_MESSAGES.USERS.FETCH_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateUser(requestDto: UpdateUserRequestDto, req: ExpressRequest): Promise<IUserResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      // Validar que el usuario existe
      await this.validateUserExists(requestDto.id);

      const user = await this.userCrudRepository.updateUser({
        id: requestDto.id,
        updateUserDto: requestDto.updateData,
        performedBy: currentUserId,
      });

      return {
        data: this.buildUserProfile(user),
        message: SUCCESS_MESSAGES.USERS.UPDATE_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(
    requestDto: DeleteUserRequestDto,
    req: ExpressRequest,
  ): Promise<IDeleteUserResponse> {
    try {
      const currentUserId = (req as any).user?.userId;

      // Validar que el usuario existe
      await this.validateUserExists(requestDto.id);

      await this.userCrudRepository.softDeleteUser({
        id: requestDto.id,
        performedBy: currentUserId,
      });

      return {
        data: { id: requestDto.id },
        message: SUCCESS_MESSAGES.USERS.DELETE_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  // PUBLIC SEARCH METHODS - Always receive (dto, req)
  async searchUsers(
    requestDto: GetUsersBySearchDto,
    req: ExpressRequest,
  ): Promise<IUsersListResponse> {
    try {
      const currentUserId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      const result = await this.userSearchRepository.exactSearch({
        searchData: requestDto.searchData,
        pagination: requestDto.pagination,
        performedBy: currentUserId,
        userRole,
      });

      return {
        data: result.data.map((user) => this.buildUserProfile(user)),
        meta: result.meta,
        message: SUCCESS_MESSAGES.USERS.SEARCH_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async filterUsers(
    requestDto: GetUsersByFilterDto,
    req: ExpressRequest,
  ): Promise<IUsersListResponse> {
    try {
      const currentUserId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      const result = await this.userSearchRepository.simpleFilter({
        term: requestDto.term,
        pagination: requestDto.pagination,
        performedBy: currentUserId,
        userRole,
      });

      return {
        data: result.data.map((user) => this.buildUserProfile(user)),
        meta: result.meta,
        message: SUCCESS_MESSAGES.USERS.FILTER_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async findUsers(
    requestDto: GetUsersByAdvancedFilterDto,
    req: ExpressRequest,
  ): Promise<IUsersListResponse> {
    try {
      const currentUserId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      const result = await this.userSearchRepository.findWithFilters({
        filters: requestDto.filters,
        pagination: requestDto.pagination,
        performedBy: currentUserId,
        userRole,
      });

      return {
        data: result.data.map((user) => this.buildUserProfile(user)),
        meta: result.meta,
        message: SUCCESS_MESSAGES.USERS.FILTER_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  async exportUsersCsv(requestDto: ExportUsersCsvRequestDto, req: ExpressRequest): Promise<string> {
    try {
      const currentUserId = (req as any).user?.userId;

      return await this.userSearchRepository.exportToCsv({
        filters: requestDto.filters,
        performedBy: currentUserId,
      });
    } catch (error) {
      throw error;
    }
  }

  // PUBLIC SPECIAL METHODS - Auth service integration
  async findToLoginByEmail(email: string): Promise<User | null> {
    return await this.userSearchRepository.findToLoginByEmail(email);
  }

  async registerUser(
    requestDto: { registrationData: any },
    req: ExpressRequest,
  ): Promise<IUserResponse> {
    try {
      const currentUserId = (req as any).user?.userId || 'system';

      // Validar restricciones únicas
      await this.validateUniqueConstraints(requestDto.registrationData);

      // Asignar rol por defecto si no se proporciona
      if (!requestDto.registrationData.roleId) {
        const defaultRole = await this.getDefaultRole();
        requestDto.registrationData.roleId = defaultRole.id;
      }

      const user = await this.userCrudRepository.createUser({
        createUserDto: requestDto.registrationData,
        performedBy: currentUserId,
      });

      return {
        data: this.buildUserProfile(user),
        message: SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS,
      };
    } catch (error) {
      throw error;
    }
  }

  // Keep the old register method for backward compatibility with auth service
  async register(userData: any): Promise<User> {
    // Validar restricciones únicas
    await this.validateUniqueConstraints(userData);

    // Asignar rol por defecto si no se proporciona
    if (!userData.roleId) {
      const defaultRole = await this.getDefaultRole();
      userData.roleId = defaultRole.id;
    }

    return await this.userCrudRepository.createUser({
      createUserDto: userData,
      performedBy: 'system', // For auth registration
    });
  }

  // PRIVATE HELPER METHODS - Internal logic
  private buildUserProfile(user: User): IUserProfile {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name, // Convert Role entity to string
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private async validateUniqueConstraints(userData: any): Promise<void> {
    // Verificar si el email ya existe
    const existingUserByEmail = await this.userCrudRepository.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new ForbiddenException(ERROR_MESSAGES.USERS.EMAIL_EXISTS);
    }

    // Verificar si el username ya existe
    const existingUserByUsername = await this.userCrudRepository.findByUsername(userData.username);
    if (existingUserByUsername) {
      throw new ForbiddenException(ERROR_MESSAGES.USERS.USERNAME_EXISTS);
    }
  }

  private async validateUserExists(id: string): Promise<void> {
    const user = await this.userCrudRepository._findById(id);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USERS.NOT_FOUND);
    }
  }

  private async getDefaultRole(): Promise<Role> {
    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'USER' },
    });

    if (!defaultRole) {
      throw new NotFoundException(ERROR_MESSAGES.ROLES.NOT_FOUND);
    }

    return defaultRole;
  }
}
