import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  ILike,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { IInventoryMovementSearchRepository } from '../interfaces/inventory-movement-search.repository.interface';
import { MovementFiltersDto } from '../dto/movement-filters.dto';
import { MovementAdvancedFiltersDto } from '../dto/movement-advanced-filters.dto';
import { InventoryMovementExactSearchDto } from '../dto/inventory-movement-exact-search.dto';
import { InventoryMovementSimpleFilterDto } from '../dto/inventory-movement-simple-filter.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class InventoryMovementSearchRepository
  extends BaseRepository<InventoryMovement>
  implements IInventoryMovementSearchRepository
{
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly inventoryMovementRepository: Repository<InventoryMovement>,
  ) {
    super(inventoryMovementRepository);
  }

  async exactSearchMovements(
    searchDto: InventoryMovementExactSearchDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>> {
    try {
      const whereCondition: any = {};
      whereCondition[searchDto.searchField] = searchDto.searchValue;

      if (userRole !== 'ADMIN' && userId) {
        whereCondition.userId = userId;
      }

      const options: FindManyOptions<InventoryMovement> = {
        where: whereCondition,
        order: { [searchDto.sortBy]: searchDto.sortOrder },
        skip: searchDto.offset,
        take: searchDto.limit,
        relations: ['user'],
      };

      return await this._findManyWithPagination(options, searchDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to search inventory movements',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async simpleFilterMovements(
    filterDto: InventoryMovementSimpleFilterDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>> {
    try {
      const maxLimit = Math.min(filterDto.limit || 10, 50);

      // If no search term provided, return all movements with pagination
      if (!filterDto.term || filterDto.term.trim().length === 0) {
        const whereConditions: any = {};
        if (userRole !== 'ADMIN' && userId) {
          whereConditions.userId = userId;
        }

        const options: FindManyOptions<InventoryMovement> = {
          where: whereConditions,
          relations: ['user'],
          order: { [filterDto.sortBy || 'createdAt']: filterDto.sortOrder || 'DESC' },
          skip: filterDto.offset,
          take: maxLimit,
        };
        return await this._findManyWithPagination(options, filterDto);
      }

      // Validate minimum search term length
      const trimmedTerm = filterDto.term.trim();
      if (trimmedTerm.length < 3) {
        throw new HttpException(
          'Search term must be at least 3 characters long',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Use TypeORM QueryBuilder for efficient LIKE queries across all fields
      const queryBuilder = this.repository
        .createQueryBuilder('movement')
        .leftJoinAndSelect('movement.user', 'user')
        .where('movement.isActive = :isActive', { isActive: true }) // Active filter
        .andWhere(
          '(LOWER(movement.notes) LIKE LOWER(:term) OR ' +
            'LOWER(CAST(movement.movementType AS VARCHAR)) LIKE LOWER(:term) OR ' +
            'LOWER(movement.entityType) LIKE LOWER(:term) OR ' +
            'CAST(movement.quantityBefore AS VARCHAR) LIKE :term OR ' +
            'CAST(movement.quantityAfter AS VARCHAR) LIKE :term OR ' +
            'LOWER(user.username) LIKE LOWER(:term) OR ' +
            'LOWER(user.email) LIKE LOWER(:term))',
          { term: `%${trimmedTerm}%` },
        );

      // Add user filter if not admin
      if (userRole !== 'ADMIN' && userId) {
        queryBuilder.andWhere('movement.userId = :userId', { userId });
      }

      // Get total count for pagination metadata
      const totalCount = await queryBuilder.getCount();

      // Apply sorting and pagination
      queryBuilder
        .orderBy(`movement.${filterDto.sortBy || 'createdAt'}`, filterDto.sortOrder || 'DESC')
        .skip(filterDto.offset)
        .take(maxLimit);

      const movements = await queryBuilder.getMany();

      // Return using standard pagination format
      return {
        data: movements,
        meta: {
          total: totalCount,
          page: filterDto.page,
          limit: maxLimit,
          totalPages: Math.ceil(totalCount / maxLimit),
          hasNext: filterDto.offset + maxLimit < totalCount,
          hasPrev: filterDto.page > 1,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Failed to filter inventory movements',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findWithFilters(
    filters: MovementAdvancedFiltersDto,
    pagination: PaginationDto,
    userId?: string,
    userRole?: string,
  ): Promise<PaginatedResult<InventoryMovement>> {
    try {
      const whereConditions: any = {};

      if (userRole !== 'ADMIN' && userId) {
        whereConditions.userId = userId;
      }

      if (filters.movementType) {
        whereConditions.movementType = filters.movementType;
      }

      if (filters.entityType) {
        whereConditions.entityType = filters.entityType;
      }

      if (filters.notes) {
        whereConditions.notes = ILike(`%${filters.notes}%`);
      }

      if (filters.createdAfter && filters.createdBefore) {
        whereConditions.createdAt = Between(
          new Date(filters.createdAfter),
          new Date(filters.createdBefore),
        );
      } else if (filters.createdAfter) {
        whereConditions.createdAt = MoreThanOrEqual(new Date(filters.createdAfter));
      } else if (filters.createdBefore) {
        whereConditions.createdAt = LessThanOrEqual(new Date(filters.createdBefore));
      }

      const options: FindManyOptions<InventoryMovement> = {
        where: whereConditions,
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
        relations: ['user'],
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException(
        'Failed to filter inventory movements',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async exportToCsv(
    filters?: MovementFiltersDto,
    userId?: string,
    userRole?: string,
  ): Promise<string> {
    try {
      const whereConditions: any = {};

      if (userRole !== 'ADMIN' && userId) {
        whereConditions.userId = userId;
      }

      if (filters?.movementType) {
        whereConditions.movementType = filters.movementType;
      }

      if (filters?.entityType) {
        whereConditions.entityType = filters.entityType;
      }

      if (filters?.notes) {
        whereConditions.notes = ILike(`%${filters.notes}%`);
      }

      const movements = await this._findMany({
        where: whereConditions,
        order: { createdAt: 'DESC' },
        relations: ['user'],
      });

      const csvHeaders =
        'ID,Movement Type,Entity Type,Entity ID,Notes,User,Created At,Updated At\n';
      const csvRows = movements
        .map((movement) => {
          const userFullName = movement.user
            ? `${movement.user.firstName} ${movement.user.lastName}`
            : 'N/A';
          const notes = movement.notes ? movement.notes.replace(/"/g, '""') : 'N/A';
          const createdAt = movement.createdAt
            ? this.formatDateTimeForCsv(movement.createdAt)
            : 'N/A';
          const updatedAt = movement.updatedAt
            ? this.formatDateTimeForCsv(movement.updatedAt)
            : 'N/A';

          return `"${movement.id}","${movement.movementType}","${movement.entityType}","${movement.entityId}","${notes}","${userFullName}","${createdAt}","${updatedAt}"`;
        })
        .join('\n');

      return csvHeaders + csvRows;
    } catch (error) {
      throw new HttpException(
        'Failed to export inventory movements to CSV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Helper method to format datetime safely for CSV export
   * @private
   */
  private formatDateTimeForCsv(date: Date | string): string {
    try {
      if (!date) return '';

      // If it's a string, try to parse it as a Date
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString();
        }
        return '';
      }

      // If it's a Date object, format it
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toISOString();
      }

      return '';
    } catch (error) {
      return '';
    }
  }
}
