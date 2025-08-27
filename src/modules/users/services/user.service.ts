import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { BusinessException } from '../../../common/exceptions/business.exception';
import { AuditLogService } from '../../audit/services/audit-log.service';
import { AuditAction } from '../../audit/entities/audit-log.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: string): Promise<User> {
    const user = await this.userRepository.registerUser(createUserDto);

    if (createdBy) {
      await this.auditLogService.logOperation(
        createdBy,
        user.id,
        AuditAction.CREATE,
        `User created: ${user.username} (${user.email})`,
        'User',
      );
    }

    return user;
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<User>> {
    return this.userRepository.getAllUsers(pagination);
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.getUserProfile(id);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.authenticateUser(username);
  }

  async findByEmail(email: string): Promise<boolean> {
    return this.userRepository.checkEmailExists(email);
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy?: string): Promise<User> {
    const updatedUser = await this.userRepository.updateUserProfile(id, updateUserDto);

    if (updatedBy) {
      const changes = Object.keys(updateUserDto).map(key => `${key}: ${updateUserDto[key]}`).join(', ');
      await this.auditLogService.logOperation(
        updatedBy,
        id,
        AuditAction.UPDATE,
        `User updated: ${changes}`,
        'User',
      );
    }

    return updatedUser;
  }

  async softDelete(id: string, deletedBy?: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.deactivateUser(id);

    if (deletedBy) {
      await this.auditLogService.logOperation(
        deletedBy,
        id,
        AuditAction.DELETE,
        `User deleted: ${user.username} (${user.email})`,
        'User',
      );
    }
  }

}