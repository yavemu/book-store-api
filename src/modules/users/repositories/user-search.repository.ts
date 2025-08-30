import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  ILike,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  IsNull,
  Not,
} from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserSearchRepository } from '../interfaces/user-search.repository.interface';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { UserFiltersDto, UserCsvExportFiltersDto } from '../dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class UserSearchRepository extends BaseRepository<User> implements IUserSearchRepository {
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
      throw new HttpException('Authentication failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchUsers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>> {
    try {
      const options: FindManyOptions<User> = {
        where: [{ username: ILike(`%${searchTerm}%`) }, { email: ILike(`%${searchTerm}%`) }],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to search users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async filterUsers(filterTerm: string, pagination: PaginationDto): Promise<PaginatedResult<User>> {
    try {
      // Búsqueda optimizada para tiempo real con ILIKE case-insensitive
      // Busca en username y email principalmente para performance
      const options: FindManyOptions<User> = {
        where: [{ username: ILike(`%${filterTerm}%`) }, { email: ILike(`%${filterTerm}%`) }],
        order: { username: 'ASC' }, // Orden más rápido para filtros
        skip: pagination.offset,
        take: Math.min(pagination.limit, 50), // Limitar resultados para performance
        cache: {
          id: `user_filter_${filterTerm.toLowerCase()}_${pagination.page}_${pagination.limit}`,
          milliseconds: 30000, // Cache de 30 segundos para búsquedas repetidas
        },
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to filter users', HttpStatus.INTERNAL_SERVER_ERROR);
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

  async findUsersWithFilters(
    filters: UserFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<User>> {
    try {
      const whereConditions: any = {};

      if (filters.name) {
        whereConditions.username = ILike(`%${filters.name}%`);
      }

      if (filters.email) {
        whereConditions.email = ILike(`%${filters.email}%`);
      }

      if (filters.role) {
        whereConditions.role = filters.role;
      }

      if (filters.isActive !== undefined) {
        whereConditions.deletedAt = filters.isActive ? IsNull() : Not(IsNull());
      }

      const options: FindManyOptions<User> = {
        where: whereConditions,
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to filter users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async exportUsersToCsv(filters: UserCsvExportFiltersDto): Promise<string> {
    try {
      const whereConditions: any = {};

      if (filters.name) {
        whereConditions.username = ILike(`%${filters.name}%`);
      }

      if (filters.email) {
        whereConditions.email = ILike(`%${filters.email}%`);
      }

      if (filters.role) {
        whereConditions.role = filters.role;
      }

      if (filters.isActive !== undefined) {
        whereConditions.deletedAt = filters.isActive ? IsNull() : Not(IsNull());
      }

      // Date range filters
      if (filters.createdDateFrom && filters.createdDateTo) {
        whereConditions.createdAt = Between(
          new Date(filters.createdDateFrom),
          new Date(filters.createdDateTo),
        );
      } else if (filters.createdDateFrom) {
        whereConditions.createdAt = MoreThanOrEqual(new Date(filters.createdDateFrom));
      } else if (filters.createdDateTo) {
        whereConditions.createdAt = LessThanOrEqual(new Date(filters.createdDateTo));
      }

      if (filters.updatedDateFrom && filters.updatedDateTo) {
        whereConditions.updatedAt = Between(
          new Date(filters.updatedDateFrom),
          new Date(filters.updatedDateTo),
        );
      } else if (filters.updatedDateFrom) {
        whereConditions.updatedAt = MoreThanOrEqual(new Date(filters.updatedDateFrom));
      } else if (filters.updatedDateTo) {
        whereConditions.updatedAt = LessThanOrEqual(new Date(filters.updatedDateTo));
      }

      const users = await this._findMany({
        where: whereConditions,
        order: { createdAt: 'DESC' },
      });

      // Generate CSV
      if (users.length === 0) {
        return 'ID,Username,Email,Role,Is Active,Created At,Updated At\n';
      }

      const csvHeaders = 'ID,Username,Email,Role,Is Active,Created At,Updated At\n';
      const csvRows = users
        .map(
          (user) =>
            `${user.id},"${user.username}","${user.email}","${user.role?.name || ''}","${!user.deletedAt}","${user.createdAt?.toISOString() || ''}","${user.updatedAt?.toISOString() || ''}"`,
        )
        .join('\n');

      return csvHeaders + csvRows;
    } catch (error) {
      throw new HttpException('Failed to export users to CSV', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { email: email.toLowerCase().trim() },
      });
    } catch (error) {
      throw new HttpException('Failed to check email existence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
