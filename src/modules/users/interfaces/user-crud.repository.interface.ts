import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IUserCrudRepository {
  registerUser(createUserDto: CreateUserDto, performedBy?: string): Promise<User>;
  getAllUsers(pagination: PaginationDto): Promise<PaginatedResult<User>>;
  getUserProfile(userId: string): Promise<User>;
  updateUserProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
    performedBy?: string,
  ): Promise<User>;
  deactivateUser(userId: string, performedBy?: string): Promise<{ id: string }>;
}
