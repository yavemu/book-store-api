import { Injectable, Inject } from '@nestjs/common';
import { IUserCrudService } from '../interfaces/user-crud.service.interface';
import { IUserCrudRepository } from '../interfaces/user-crud.repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { RegisterUserDto } from '../dto';

@Injectable()
export class UserCrudService implements IUserCrudService {
  constructor(
    @Inject('IUserCrudRepository')
    private readonly userCrudRepository: IUserCrudRepository,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    createdBy?: string,
  ): Promise<User> {
    return this.userCrudRepository.registerUser(createUserDto, createdBy);
  }

  async register(
    registerUser: RegisterUserDto,
    createdBy?: string,
  ): Promise<User> {
    return this.userCrudRepository.registerUser(registerUser, createdBy);
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginatedResult<User>> {
    return this.userCrudRepository.getAllUsers(pagination);
  }

  async findById(id: string): Promise<User> {
    return this.userCrudRepository.getUserProfile(id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updatedBy?: string,
  ): Promise<User> {
    return this.userCrudRepository.updateUserProfile(id, updateUserDto, updatedBy);
  }

  async softDelete(
    id: string,
    deletedBy?: string,
  ): Promise<{ id: string }> {
    return this.userCrudRepository.deactivateUser(id, deletedBy);
  }
}
