import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { RegisterUserDto } from '../dto';

export interface IUserCrudService {
  create(createUserDto: CreateUserDto, createdBy?: string): Promise<User>;
  register(registerUser: RegisterUserDto, createdBy?: string): Promise<User>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User>;
  update(id: string, updateUserDto: UpdateUserDto, updatedBy?: string): Promise<User>;
  softDelete(id: string, deletedBy?: string): Promise<{ id: string }>;
}
