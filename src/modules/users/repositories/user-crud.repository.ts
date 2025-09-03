import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserCrudRepository, IUserValidationRepository } from '../interfaces';
import { PaginatedResult } from '../interfaces';
import { BaseRepository } from '../../../common/repositories/base.repository';
import {
  ICreateUserParams,
  IGetUserByIdParams,
  IGetAllUsersParams,
  IUpdateUserParams,
  IDeactivateUserParams,
} from '../interfaces';
@Injectable()
export class UserCrudRepository extends BaseRepository<User> implements Omit<IUserCrudRepository, keyof import('../../../common/interfaces/base-repository.interface').IBaseRepository<User>>, IUserValidationRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async createUser(params: ICreateUserParams): Promise<User> {
    return await this._create(
      params.createUserDto,
      params.performedBy || 'system',
      'User',
      (user) => `User created: ${user.username} (${user.email})`,
    );
  }

  async getUserById(params: IGetUserByIdParams): Promise<User> {
    return await this._findById(params.userId);
  }

  async getAllUsers(params: IGetAllUsersParams): Promise<PaginatedResult<User>> {
    const options = {
      order: { [params.pagination.sortBy]: params.pagination.sortOrder },
      skip: params.pagination.offset,
      take: params.pagination.limit,
    };

    return await this._findManyWithPagination(options, params.pagination);
  }

  async updateUser(params: IUpdateUserParams): Promise<User> {
    return await this._update(
      params.userId,
      params.updateUserDto,
      params.performedBy,
      'User',
      () => `User updated: ${params.userId}`,
    );
  }

  async deleteUser(params: IDeactivateUserParams): Promise<{ id: string }> {
    return await this._softDelete(
      params.userId,
      params.performedBy,
      'User',
      () => `User deleted: ${params.userId}`,
    );
  }

  // Validation methods
  async findByEmail(email: string): Promise<User | null> {
    return await this._findByField('email', email);
  }

  async findByEmailExcludingId(email: string, excludeId: string): Promise<User | null> {
    return await this._findByField('email', email, { excludeId });
  }

  async findByUsername(username: string): Promise<User> {
    return await this._findByField('username', username);
  }

  async findByUsernameExcludingId(username: string, excludeId: string): Promise<User> {
    return await this._findByField('username', username, { excludeId });
  }
}
