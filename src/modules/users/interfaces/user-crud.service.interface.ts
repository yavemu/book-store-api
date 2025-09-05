import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { RegisterUserDto } from '../dto';
import { ListSelectDto } from '../../../common/dto/list-select.dto';

export interface IUserCrudService {
  create(createUserDto: CreateUserDto, createdBy?: string): Promise<User>;
  register(registerUser: RegisterUserDto, createdBy?: string): Promise<User>;
  findAll(
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<User>>;
  findById(id: string, requestingUserId?: string, requestingUserRole?: string): Promise<User>;
  update(
    id: string,
    updateUserDto: UpdateUserDto,
    updatedBy?: string,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<User>;
  softDelete(id: string, deletedBy?: string): Promise<{ id: string }>;
  findForSelect(): Promise<ListSelectDto[]>;
}
