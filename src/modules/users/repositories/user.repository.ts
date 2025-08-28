import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { UserRole } from '../enums/user-role.enum';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';
import { SUCCESS_MESSAGES } from '../../../common/exceptions/success-messages';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(userRepository);
  }

  // Public business logic methods

  async registerUser(
    createUserDto: CreateUserDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<User>> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createUserDto, undefined, [
        {
          field: 'username',
          message: 'Username already exists',
          transform: (value: string) => value.toLowerCase().trim(),
        },
        {
          field: 'email',
          message: 'Email already exists',
          transform: (value: string) => value.toLowerCase().trim(),
        },
      ]);

      // If no roleId provided, assign USER role by default
      if (!createUserDto.roleId) {
        const userRole = await this.roleRepository.findOne({
          where: { name: UserRole.USER.toLowerCase(), isActive: true },
        });
        if (userRole) {
          createUserDto.roleId = userRole.id;
        }
      }

      // Use inherited method from BaseRepository with audit
      return await this._createEntity(
        createUserDto,
        SUCCESS_MESSAGES.USERS.CREATED,
        performedBy,
        'User',
        (user) => `User created: ${user.username} (${user.email})`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async authenticateUser(email: string): Promise<User | null> {
    try {
      return await this._findOne({
        where: { email: email.toLowerCase().trim() },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Authentication failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserProfile(userId: string): Promise<SuccessResponseDto<User>> {
    try {
      const user = await this._findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return new SuccessResponseDto(SUCCESS_MESSAGES.USERS.FOUND_ONE, user);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to get user profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<User>> {
    try {
      const userResponse = await this.getUserProfile(userId);
      const user = userResponse.data;

      // Check username uniqueness if changing
      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUser = await this._findOne({
          where: { username: updateUserDto.username.toLowerCase().trim() },
        });
        if (existingUser) {
          throw new ConflictException('Username already exists');
        }
      }

      // Check email uniqueness if changing
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this._findOne({
          where: { email: updateUserDto.email.toLowerCase().trim() },
        });
        if (existingUser) {
          throw new ConflictException('Email already exists');
        }
      }

      // Use inherited method from BaseRepository with audit
      return await this._updateEntity(
        userId,
        updateUserDto,
        SUCCESS_MESSAGES.USERS.UPDATED,
        performedBy,
        'User',
        (user) => {
          const changes = Object.keys(updateUserDto)
            .map((key) => `${key}: ${updateUserDto[key]}`)
            .join(', ');
          return `User updated: ${changes}`;
        },
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update user profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deactivateUser(
    userId: string,
    performedBy?: string,
  ): Promise<SuccessResponseDto<{ id: string }>> {
    try {
      const userResponse = await this.getUserProfile(userId); // Verify user exists
      const user = userResponse.data;
      // Use inherited method from BaseRepository with audit
      return await this._softDelete(
        userId,
        SUCCESS_MESSAGES.USERS.DELETED,
        performedBy,
        'User',
        () => `User deleted: ${user.username} (${user.email})`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to deactivate user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchUsers(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<User>>> {
    try {
      const options: FindManyOptions<User> = {
        where: [
          { username: ILike(`%${searchTerm}%`) },
          { email: ILike(`%${searchTerm}%`) },
        ],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.USERS.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to search users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllUsers(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<User>>> {
    try {
      const options: FindManyOptions<User> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      const paginatedResult = await this._findManyWithPagination(
        options,
        pagination,
      );
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.USERS.FOUND_ALL,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get all users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { username: username.toLowerCase().trim() },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to check username existence',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { email: email.toLowerCase().trim() },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to check email existence',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
