import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../../../common/enums/user-role.enum';
import { IUserCrudService } from '../interfaces/user-crud.service.interface';
import { IUserCrudRepository } from '../interfaces/user-crud.repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { RegisterUserDto } from '../dto';
import { ListSelectDto } from '../../../common/dto/list-select.dto';

@Injectable()
export class UserCrudService implements IUserCrudService {
  constructor(
    @Inject('IUserCrudRepository')
    private readonly userCrudRepository: IUserCrudRepository,
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: string): Promise<User> {
    return this.userCrudRepository.registerUser(createUserDto, createdBy);
  }

  async register(registerUser: RegisterUserDto, createdBy?: string): Promise<User> {
    return this.userCrudRepository.registerUser(registerUser, createdBy);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<User>> {
    return this.userCrudRepository.getAllUsers(pagination);
  }

  async findById(
    id: string,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<User> {
    // Solo aplicar restricciones para usuarios con rol USER
    if (requestingUserRole === UserRole.USER && requestingUserId !== id) {
      throw new ForbiddenException('Solo puedes acceder a tu propio perfil');
    }

    return this.userCrudRepository.getUserProfile(id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updatedBy?: string,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<User> {
    // Solo aplicar restricciones para usuarios con rol USER
    if (requestingUserRole === UserRole.USER && requestingUserId !== id) {
      throw new ForbiddenException('Solo puedes actualizar tu propio perfil');
    }

    // Nota: UpdateUserDto actualmente no incluye roleId, pero se mantiene la lógica por si se agrega en el futuro

    return this.userCrudRepository.updateUserProfile(id, updateUserDto, updatedBy);
  }

  async softDelete(id: string, deletedBy?: string): Promise<{ id: string }> {
    return this.userCrudRepository.deactivateUser(id, deletedBy);
  }

  async findForSelect(): Promise<ListSelectDto[]> {
    const users = await this.userCrudRepository.findForSelect();
    return users.map((user) => ({
      id: user.id,
      name:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName} (${user.username})`
          : user.username,
    }));
  }
}
