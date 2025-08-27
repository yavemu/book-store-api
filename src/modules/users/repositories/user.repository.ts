import { Injectable, NotFoundException, ConflictException, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions, ILike } from "typeorm";
import { User } from "../entities/user.entity";
import { UserRole } from "../enums/user-role.enum";
import { IUserRepository } from "../interfaces/user.repository.interface";
import { CreateUserDto } from "../dto/create-user.dto";
import { UpdateUserDto } from "../dto/update-user.dto";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { BaseRepository } from "../../../common/repositories/base.repository";

@Injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  // Public business logic methods

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createUserDto, undefined, [
        {
          field: "username",
          message: "Username already exists",
          transform: (value: string) => value.toLowerCase().trim(),
        },
        {
          field: "email",
          message: "Email already exists",
          transform: (value: string) => value.toLowerCase().trim(),
        },
      ]);

      // Use inherited method from BaseRepository
      return await this._createEntity(createUserDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Failed to register user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async authenticateUser(email: string): Promise<User | null> {
    try {
      return await this._findOne({
        where: { email: email.toLowerCase().trim() },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException("Authentication failed", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserProfile(userId: string): Promise<User> {
    try {
      const user = await this._findById(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Failed to get user profile", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.getUserProfile(userId);

      // Check username uniqueness if changing
      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUser = await this._findOne({
          where: { username: updateUserDto.username.toLowerCase().trim() },
        });
        if (existingUser) {
          throw new ConflictException("Username already exists");
        }
      }

      // Check email uniqueness if changing
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this._findOne({
          where: { email: updateUserDto.email.toLowerCase().trim() },
        });
        if (existingUser) {
          throw new ConflictException("Email already exists");
        }
      }

      // Use inherited method from BaseRepository
      await this._updateEntity(userId, updateUserDto);
      return await this._findById(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Failed to update user profile", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateUser(userId: string): Promise<void> {
    try {
      await this.getUserProfile(userId); // Verify user exists
      // Use inherited method from BaseRepository
      await this._softDelete(userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException("Failed to deactivate user", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUsersByRole(role: string, pagination: PaginationDto): Promise<PaginatedResult<User>> {
    try {
      const options: FindManyOptions<User> = {
        where: { role: role as UserRole },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException("Failed to get users by role", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchUsers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>> {
    try {
      const options: FindManyOptions<User> = {
        where: [{ username: ILike(`%${searchTerm}%`) }, { email: ILike(`%${searchTerm}%`) }],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException("Failed to search users", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers(pagination: PaginationDto): Promise<PaginatedResult<User>> {
    try {
      const options: FindManyOptions<User> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException("Failed to get all users", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { username: username.toLowerCase().trim() },
      });
    } catch (error) {
      throw new HttpException("Failed to check username existence", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { email: email.toLowerCase().trim() },
      });
    } catch (error) {
      throw new HttpException("Failed to check email existence", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
