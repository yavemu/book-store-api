import { HttpStatus } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterUserDto } from './dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';
import {
  UserFiltersDto,
  UserCsvExportFiltersDto,
  UserExactSearchDto,
  UserSimpleFilterDto,
} from './dto';

// Re-export common types for convenience
export { PaginationDto, PaginatedResult };

// ============================================================================
// SERVICE PARAMETER INTERFACES
// ============================================================================

export interface ICreateUserServiceParams {
  userData: CreateUserDto;
  performedBy?: string;
}

export interface IRegisterUserServiceParams {
  userData: RegisterUserDto;
  createdBy?: string;
}

export interface ILoginUserServiceParams {
  email: string;
  password: string;
  ipAddress?: string;
}

export interface IGetAllUsersServiceParams {
  pagination: PaginationDto;
  userId?: string;
  userRole?: string;
}

export interface IGetUserByIdServiceParams {
  id: string;
  requestingUserId?: string;
  requestingUserRole?: string;
}

export interface IUpdateUserServiceParams {
  id: string;
  updateData: UpdateUserDto;
  updatedBy?: string;
  requestingUserId?: string;
  requestingUserRole?: string;
}

export interface ISoftDeleteUserServiceParams {
  id: string;
  userId?: string;
  deletedBy?: string;
}

// ============================================================================
// REPOSITORY PARAMETER INTERFACES
// ============================================================================

export interface ICreateUserParams {
  createUserDto: CreateUserDto;
  performedBy?: string;
}

export interface IGetUserByIdParams {
  userId: string;
}

export interface IGetAllUsersParams {
  pagination: PaginationDto;
}

export interface IUpdateUserParams {
  userId: string;
  updateUserDto: UpdateUserDto;
  performedBy?: string;
}

export interface IDeactivateUserParams {
  userId: string;
  performedBy?: string;
}

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IUserCrudService {
  createUser(params: ICreateUserServiceParams): Promise<User>;
  registerUser(params: IRegisterUserServiceParams): Promise<User>;
  loginUser(params: ILoginUserServiceParams): Promise<User>;
  getAllUsers(params: IGetAllUsersServiceParams): Promise<PaginatedResult<User>>;
  getUserById(params: IGetUserByIdServiceParams): Promise<User>;
  updateUser(params: IUpdateUserServiceParams): Promise<User>;
  deleteUser(params: ISoftDeleteUserServiceParams): Promise<{ id: string }>;
  findById(id: string, userId?: string, userRole?: string): Promise<User>;
  update(id: string, updateData: any, userId: string): Promise<User>;
  softDelete(id: string, userId: string): Promise<{ id: string }>;
  // Additional methods for controller compatibility
  create(userData: any, performedBy: string): Promise<User>;
  findAll(pagination: any, userId?: string, userRole?: string): Promise<PaginatedResult<User>>;
  register(registerData: any): Promise<User>;
}

export interface IUserSearchService {
  exactSearch(
    searchDto: UserExactSearchDto,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>>;
  simpleFilter(
    term: string,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>>;
  findWithFilters(
    filters: UserFiltersDto,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>>;
  exportToCsv(filters: UserCsvExportFiltersDto): Promise<string>;
  findByEmail(email: string): Promise<boolean>;
  findToLoginByEmail(email: string): Promise<User | null>;
}

export interface IUserAuthService {
  logLogin(userId: string): Promise<void>;
}

export interface IValidationService {
  validateUniqueConstraints<T>(
    dto: Partial<T>,
    entityId?: string,
    constraints?: Array<{
      field: string | string[];
      message: string;
      transform?: (value: any) => any;
    }>,
    repository?: any,
  ): Promise<void>;
}

export interface IErrorHandlerService {
  handleError(error: any, fallbackMessage: string, fallbackStatus?: HttpStatus): never;
  createNotFoundException(message: string): never;
  createConflictException(message: string): never;
}

export interface IUserContextService {
  extractUserId(request: any): string;
  getCurrentUser(request: any): { id: string; [key: string]: any };
}

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface IUserCrudRepository extends IBaseRepository<User> {
  createUser(params: ICreateUserParams): Promise<User>;
  getUserById(params: IGetUserByIdParams): Promise<User>;
  getAllUsers(params: IGetAllUsersParams): Promise<PaginatedResult<User>>;
  updateUser(params: IUpdateUserParams): Promise<User>;
  deleteUser(params: IDeactivateUserParams): Promise<{ id: string }>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailExcludingId(email: string, excludeId: string): Promise<User | null>;
}

export interface IUserSearchRepository {
  searchUsers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>>;
  filterUsers(filterTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>>;
  simpleFilterUsers(
    term: string,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>>;
  findUsersWithFilters(
    filters: UserFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<User>>;
  exportUsersToCsv(filters: UserCsvExportFiltersDto): Promise<string>;
  exactSearchUsers(
    searchDto: UserExactSearchDto,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>>;
  checkUsernameExists(username: string): Promise<boolean>;
  checkEmailExists(email: string): Promise<boolean>;
  authenticateUser(email: string): Promise<User | null>;
}

export interface IUserValidationRepository {
  findByEmail(email: string): Promise<User>;
  findByEmailExcludingId(email: string, excludeId: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findByUsernameExcludingId(username: string, excludeId: string): Promise<User>;
}