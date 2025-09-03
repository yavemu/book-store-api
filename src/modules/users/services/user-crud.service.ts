import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../../../common/enums/user-role.enum';
import { IUserCrudService, IUserCrudRepository } from '../interfaces';
import { User } from '../entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { PaginatedResult } from '../../../common/dto/pagination.dto';
import { USER_ERROR_MESSAGES } from '../enums/error-messages.enum';
import { AuditAction } from '../../audit/enums/audit-action.enum';
import {
  ICreateUserServiceParams,
  IRegisterUserServiceParams,
  ILoginUserServiceParams,
  IGetAllUsersServiceParams,
  IGetUserByIdServiceParams,
  IUpdateUserServiceParams,
  ISoftDeleteUserServiceParams,
} from '../interfaces';

@Injectable()
export class UserCrudService implements IUserCrudService {
  constructor(
    @Inject('IUserCrudRepository')
    private readonly userCrudRepository: IUserCrudRepository,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createUser(params: ICreateUserServiceParams): Promise<User> {
    try {
      // Validar restricciones únicas
      await this.validateUniqueConstraints(params.userData);

      // Asignar rol por defecto si no se proporciona
      if (!params.userData.roleId) {
        const defaultRole = await this.getDefaultRole();
        params.userData.roleId = defaultRole.id;
      }

      return await this.userCrudRepository.createUser({
        createUserDto: params.userData,
        performedBy: params.performedBy,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        USER_ERROR_MESSAGES.FAILED_TO_REGISTER,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registerUser(params: IRegisterUserServiceParams): Promise<User> {
    try {
      // Validar restricciones únicas
      await this.validateUniqueConstraints(params.userData);

      // Para registro siempre asignar rol USER por defecto
      const userRole = await this.roleRepository.findOne({
        where: { name: UserRole.USER.toLowerCase(), isActive: true },
      });

      if (!userRole) {
        throw new HttpException('Default user role not found', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const createUserDto = {
        ...params.userData,
        roleId: userRole.id,
      };

      return await this.userCrudRepository.createUser({
        createUserDto,
        performedBy: params.createdBy || 'self-registration',
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        USER_ERROR_MESSAGES.FAILED_TO_REGISTER,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginUser(params: ILoginUserServiceParams): Promise<User> {
    try {
      const user = await this.userCrudRepository.findByEmail(params.email);
      if (!user) {
        throw new NotFoundException(USER_ERROR_MESSAGES.NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        USER_ERROR_MESSAGES.FAILED_TO_AUTHENTICATE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers(params: IGetAllUsersServiceParams): Promise<PaginatedResult<User>> {
    try {
      return await this.userCrudRepository.getAllUsers({
        pagination: params.pagination,
      });
    } catch (error) {
      throw new HttpException(
        USER_ERROR_MESSAGES.FAILED_TO_GET_ALL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(params: IGetUserByIdServiceParams): Promise<User> {
    try {
      // Solo aplicar restricciones para usuarios con rol USER
      if (params.requestingUserRole === UserRole.USER && params.requestingUserId !== params.id) {
        throw new ForbiddenException('Solo puedes acceder a tu propio perfil');
      }

      const user = await this.userCrudRepository.getUserById({ userId: params.id });
      if (!user) {
        throw new NotFoundException(USER_ERROR_MESSAGES.NOT_FOUND);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        USER_ERROR_MESSAGES.FAILED_TO_GET_PROFILE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(params: IUpdateUserServiceParams): Promise<User> {
    try {
      // Solo aplicar restricciones para usuarios con rol USER
      if (params.requestingUserRole === UserRole.USER && params.requestingUserId !== params.id) {
        throw new ForbiddenException('Solo puedes actualizar tu propio perfil');
      }

      // Verificar que el usuario existe
      await this.getUserById({ id: params.id });

      // Validar restricciones únicas
      await this.validateUniqueConstraints(params.updateData, params.id);

      return await this.userCrudRepository.updateUser({
        userId: params.id,
        updateUserDto: params.updateData,
        performedBy: params.updatedBy,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        USER_ERROR_MESSAGES.FAILED_TO_UPDATE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(params: ISoftDeleteUserServiceParams): Promise<{ id: string }> {
    try {
      // Verificar que el usuario existe
      const user = await this.getUserById({ id: params.id });

      return await this.userCrudRepository.deleteUser({
        userId: params.id,
        performedBy: params.deletedBy,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        USER_ERROR_MESSAGES.FAILED_TO_DELETE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Métodos privados para lógica de negocio
  private async validateUniqueConstraints(dto: any, excludeId?: string): Promise<void> {
    const constraints = [
      {
        field: 'username',
        message: USER_ERROR_MESSAGES.USERNAME_ALREADY_EXISTS,
      },
      {
        field: 'email',
        message: USER_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS,
      },
    ];

    for (const constraint of constraints) {
      if (dto[constraint.field]) {
        const existingUser = excludeId
          ? await this.userCrudRepository.findByEmailExcludingId(dto[constraint.field], excludeId)
          : await this.userCrudRepository.findByEmail(dto[constraint.field]);

        if (existingUser) {
          throw new HttpException(constraint.message, HttpStatus.CONFLICT);
        }
      }
    }
  }

  private async getDefaultRole(): Promise<Role> {
    const defaultRole = await this.roleRepository.findOne({
      where: { name: UserRole.USER.toLowerCase(), isActive: true },
    });

    if (!defaultRole) {
      throw new HttpException('Default role not found', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return defaultRole;
  }

  // Additional methods required by interface
  async findById(id: string, userId?: string, userRole?: string): Promise<User> {
    return this.getUserById({ id, requestingUserId: userId, requestingUserRole: userRole });
  }

  async update(id: string, updateData: any, updatedBy: string): Promise<User> {
    return this.updateUser({ 
      id, 
      updateData, 
      updatedBy 
    });
  }

  async softDelete(id: string, deletedBy: string): Promise<{ id: string }> {
    return this.deleteUser({ id, userId: deletedBy });
  }

  // Controller compatibility methods
  async create(userData: any, performedBy: string): Promise<User> {
    return this.createUser({ userData, performedBy });
  }

  async findAll(pagination: any, userId?: string, userRole?: string): Promise<PaginatedResult<User>> {
    return this.getAllUsers({ pagination, userId, userRole });
  }

  async register(registerData: any): Promise<User> {
    return this.registerUser({ userData: registerData });
  }
}
