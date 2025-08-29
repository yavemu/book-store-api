import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';


export interface IUserRepository {
  // Public business logic methods
  registerUser(createUserDto: CreateUserDto, performedBy?: string): Promise<User>;
  authenticateUser(email: string): Promise<User | null>;
  getUserProfile(userId: string): Promise<User>;
  updateUserProfile(userId: string, updateUserDto: UpdateUserDto, performedBy?: string): Promise<User>;
  deactivateUser(userId: string, performedBy?: string): Promise<{ id: string }>;
  // getUsersByRole(role: string, pagination: PaginationDto): Promise<PaginatedResult<User>>;
  searchUsers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>>;
  getAllUsers(pagination: PaginationDto): Promise<PaginatedResult<User>>;
  checkUsernameExists(username: string): Promise<boolean>;
  checkEmailExists(email: string): Promise<boolean>;
  auditLogin(userId: string): Promise<void>;
}