import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { RegisterUserDto } from '../dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    createdBy?: string,
  ): Promise<SuccessResponseDto<User>> {
    return this.userRepository.registerUser(createUserDto, createdBy);
  }

  async register(
    registerUser: RegisterUserDto,
    createdBy?: string,
  ): Promise<SuccessResponseDto<User>> {
    return this.userRepository.registerUser(registerUser, createdby);
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<User>>> {
    return this.userRepository.getAllUsers(pagination);
  }

  async findById(id: string): Promise<SuccessResponseDto<User>> {
    return this.userRepository.getUserProfile(id);
  }

  async findToLoginByEmail(email: string): Promise<User | null> {
    return this.userRepository.authenticateUser(email);
  }

  async findByEmail(email: string): Promise<boolean> {
    return this.userRepository.checkEmailExists(email);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updatedBy?: string,
  ): Promise<SuccessResponseDto<User>> {
    return this.userRepository.updateUserProfile(id, updateUserDto, updatedBy);
  }

  async softDelete(
    id: string,
    deletedBy?: string,
  ): Promise<SuccessResponseDto<{ id: string }>> {
    return this.userRepository.deactivateUser(id, deletedBy);
  }
}