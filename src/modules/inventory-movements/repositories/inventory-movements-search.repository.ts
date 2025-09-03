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
import { IInventoryMovementSearchRepository } from '../interfaces';
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
      const whereConditions: any = {};

      if (userRole !== 'ADMIN' && userId) {
        whereConditions.userId = userId;
      }

      if (!filterDto.term || filterDto.term.trim() === '') {
        const options: FindManyOptions<InventoryMovement> = {
          where: whereConditions,
          order: { [filterDto.sortBy]: filterDto.sortOrder },
          skip: filterDto.offset,
          take: filterDto.limit,
          relations: ['user'],
        };
        return await this._findManyWithPagination(options, filterDto);
      }

      const allMovementsOptions: FindManyOptions<InventoryMovement> = {
        where: whereConditions,
        order: { [filterDto.sortBy]: filterDto.sortOrder },
        relations: ['user'],
      };

      const allMovements = await this._findMany(allMovementsOptions);
      const trimmedTerm = filterDto.term.trim().toLowerCase();

      const filteredMovements = allMovements.filter(
        (movement) =>
          (movement.notes && movement.notes.toLowerCase().includes(trimmedTerm)) ||
          (movement.movementType && movement.movementType.toLowerCase().includes(trimmedTerm)) ||
          (movement.entityType && movement.entityType.toLowerCase().includes(trimmedTerm)),
      );

      const total = filteredMovements.length;
      const startIndex = filterDto.offset || 0;
      const endIndex = startIndex + (filterDto.limit || 10);
      const paginatedData = filteredMovements.slice(startIndex, endIndex);

      return this._buildPaginatedResult(paginatedData, total, filterDto);
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
