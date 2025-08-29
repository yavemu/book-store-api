import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserSearchRepository } from '../interfaces/user-search.repository.interface';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class UserSearchRepository
  extends BaseRepository<User>
  implements IUserSearchRepository
{
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
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

  async searchUsers(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<User>> {
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

      return await this._findManyWithPagination(
        options,
        pagination,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to search users',
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
