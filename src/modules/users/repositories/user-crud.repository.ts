import {
  Inject,
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { UserRole } from '../enums/user-role.enum';
import { IUserCrudRepository } from '../interfaces/user-crud.repository.interface';
import { IUserValidationRepository } from '../interfaces/user-validation.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PaginatedResult } from '../../../common/interfaces/paginated-result.interface';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { IAuditLoggerService } from '../../audit/interfaces/audit-logger.service.interface';
import { AuditAction } from '../../audit/enums/audit-action.enum';

@Injectable()
export class UserCrudRepository
  extends BaseRepository<User>
  implements IUserCrudRepository, IUserValidationRepository
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService: IAuditLoggerService,
  ) {
    super(userRepository, auditLogService);
  }

  async registerUser(createUserDto: CreateUserDto, performedBy?: string): Promise<User> {
    try {
      await this._validateUniqueConstraints(createUserDto, undefined, [
        {
          field: 'username',
          message: 'El nombre de usuario ya está en uso',
          transform: (value: string) => value.toLowerCase().trim(),
        },
        {
          field: 'email',
          message: 'El correo electrónico ya está registrado',
          transform: (value: string) => value.toLowerCase().trim(),
        },
      ]);

      if (!createUserDto.roleId) {
        const userRole = await this.roleRepository.findOne({
          where: { name: UserRole.USER.toLowerCase(), isActive: true },
        });
        if (userRole) {
          createUserDto.roleId = userRole.id;
        }
      }

      const entity = this.userRepository.create(createUserDto as any);
      const savedEntity = await this.userRepository.save(entity as any);

      const action = performedBy ? AuditAction.CREATE : AuditAction.REGISTER;
      const auditPerformer = performedBy || savedEntity.id;

      await this.auditLogService.log(
        auditPerformer,
        savedEntity.id,
        action,
        `User registered: ${savedEntity.username} (${savedEntity.email})`,
        'User',
      );

      return savedEntity;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error al registrar el usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserProfile(userId: string): Promise<User> {
    try {
      const user = await this._findById(userId);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el perfil del usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
    performedBy?: string,
  ): Promise<User> {
    try {
      const user = await this.getUserProfile(userId);

      if (updateUserDto.username && updateUserDto.username !== user.username) {
        const existingUser = await this._findOne({
          where: { username: updateUserDto.username.toLowerCase().trim() },
        });
        if (existingUser) {
          throw new ConflictException('Username already exists');
        }
      }

      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this._findOne({
          where: { email: updateUserDto.email.toLowerCase().trim() },
        });
        if (existingUser) {
          throw new ConflictException('Email already exists');
        }
      }

      return await this._update(userId, updateUserDto, performedBy, 'User', (user) => {
        const changes = Object.keys(updateUserDto)
          .map((key) => `${key}: ${updateUserDto[key]}`)
          .join(', ');
        return `User updated: ${changes}`;
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update user profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivateUser(userId: string, performedBy?: string): Promise<{ id: string }> {
    try {
      const user = await this.getUserProfile(userId);
      return await this._softDelete(
        userId,
        performedBy,
        'User',
        () => `User deleted: ${user.username} (${user.email})`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to deactivate user', HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException('Failed to get all users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Validation methods
  async findByEmail(email: string): Promise<User> {
    return await this._findOne({
      where: {
        email: email.toLowerCase().trim(),
      },
    });
  }

  async findByEmailExcludingId(email: string, excludeId: string): Promise<User> {
    return await this._findOne({
      where: {
        email: email.toLowerCase().trim(),
        id: { not: excludeId } as any,
      },
    });
  }

  async findByUsername(username: string): Promise<User> {
    return await this._findOne({
      where: {
        username: username.toLowerCase().trim(),
      },
    });
  }

  async findByUsernameExcludingId(username: string, excludeId: string): Promise<User> {
    return await this._findOne({
      where: {
        username: username.toLowerCase().trim(),
        id: { not: excludeId } as any,
      },
    });
  }

  async _validateUniqueConstraints(
    dto: Partial<User>,
    entityId?: string,
    constraints?: any[],
  ): Promise<void> {
    if (!constraints) return;

    for (const constraint of constraints) {
      const fieldValue = dto[constraint.field];
      if (!fieldValue) continue;

      const transformedValue = constraint.transform ? constraint.transform(fieldValue) : fieldValue;

      let existingEntity: User;
      if (constraint.field === 'email') {
        if (entityId) {
          existingEntity = await this.findByEmailExcludingId(transformedValue, entityId);
        } else {
          existingEntity = await this.findByEmail(transformedValue);
        }
      } else if (constraint.field === 'username') {
        if (entityId) {
          existingEntity = await this.findByUsernameExcludingId(transformedValue, entityId);
        } else {
          existingEntity = await this.findByUsername(transformedValue);
        }
      }

      if (existingEntity) {
        throw new ConflictException(constraint.message);
      }
    }
  }
}
