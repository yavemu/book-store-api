import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

export interface IUserRepository {
  // Public business logic methods
  registerUser(
    createUserDto: CreateUserDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<User>>;
  authenticateUser(email: string): Promise<User | null>;
  getUserProfile(userId: string): Promise<SuccessResponseDto<User>>;
  updateUserProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<User>>;
  deactivateUser(
    userId: string,
    performedBy?: string,
  ): Promise<SuccessResponseDto<{ id: string }>>;
  // getUsersByRole(role: string, pagination: PaginationDto): Promise<SuccessResponseDto<PaginatedResult<User>>>;
  searchUsers(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<User>>>;
  getAllUsers(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<User>>>;
  checkUsernameExists(username: string): Promise<boolean>;
  checkEmailExists(email: string): Promise<boolean>;
}