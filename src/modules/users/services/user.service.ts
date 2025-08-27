import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { RegisterUserDto } from "../dto";

@Injectable()
export class UserService {
  constructor(
    @Inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: string): Promise<User> {
    return await this.userRepository.registerUser(createUserDto, createdBy);
  }

  async register(registerUser: RegisterUserDto, createdBy?: string): Promise<User> {
    return await this.userRepository.registerUser({ ...registerUser, roleId: "null" }, createdBy);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<User>> {
    return this.userRepository.getAllUsers(pagination);
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.getUserProfile(id);
  }

  async findToLoginByEmail(email: string): Promise<User | null> {
    return this.userRepository.authenticateUser(email);
  }

  async findByEmail(email: string): Promise<boolean> {
    return this.userRepository.checkEmailExists(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy?: string): Promise<User> {
    return await this.userRepository.updateUserProfile(id, updateUserDto, updatedBy);
  }

  async softDelete(id: string, deletedBy?: string): Promise<{ message: string }> {
    await this.userRepository.deactivateUser(id, deletedBy);
    return { message: "User deleted successfully" };
  }
}