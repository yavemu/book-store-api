import { Repository, FindManyOptions } from 'typeorm';
import { HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';

export abstract class BaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  // ========== MÉTODOS PRIVADOS COMUNES ==========

  protected async _createEntity(data: Partial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data as any);
      return await this.repository.save(entity as T);
    } catch (error) {
      throw new HttpException("Failed to create entity", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findById(id: string): Promise<T | null> {
    try {
      return await this.repository.findOne({ where: { id } as any });
    } catch (error) {
      throw new HttpException("Failed to find entity", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findOne(options: any): Promise<T | null> {
    try {
      return await this.repository.findOne(options);
    } catch (error) {
      throw new HttpException("Failed to find entity", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findMany(options: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (error) {
      throw new HttpException("Failed to find entities", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findManyWithPagination(options: FindManyOptions<T>, pagination: PaginationDto): Promise<PaginatedResult<T>> {
    try {
      const [data, total] = await this.repository.findAndCount(options);

      const totalPages = Math.ceil(total / pagination.limit);

      return {
        data,
        meta: {
          total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages,
          hasNext: pagination.page < totalPages,
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      throw new HttpException("Failed to find entities with pagination", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _updateEntity(id: string, data: Partial<T>): Promise<void> {
    try {
      await this.repository.update({ id } as any, data as any);
    } catch (error) {
      throw new HttpException("Failed to update entity", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _softDelete(id: string): Promise<void> {
    try {
      await this.repository.softDelete({ id } as any);
    } catch (error) {
      throw new HttpException("Failed to delete entity", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.repository.count(options);
    } catch (error) {
      throw new HttpException("Failed to count entities", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _exists(options: any): Promise<boolean> {
    try {
      const count = await this.repository.count(options);
      return count > 0;
    } catch (error) {
      throw new HttpException("Failed to check entity existence", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _validateUniqueConstraints(
    dto: any,
    entityId?: string,
    uniqueFields?: Array<{
      field: string | string[];
      message: string;
      transform?: (value: any) => any;
    }>,
  ): Promise<void> {
    if (!uniqueFields || uniqueFields.length === 0) {
      return;
    }

    for (const config of uniqueFields) {
      try {
        let whereCondition: any;

        // Handle single field or multiple field combinations
        if (Array.isArray(config.field)) {
          // Multiple field unique constraint (compound unique)
          whereCondition = {};
          for (const fieldName of config.field) {
            if (dto[fieldName] !== undefined && dto[fieldName] !== null) {
              const value = config.transform ? config.transform(dto[fieldName]) : dto[fieldName];
              whereCondition[fieldName] = value;
            }
          }
        } else {
          // Single field unique constraint
          if (dto[config.field] !== undefined && dto[config.field] !== null) {
            const value = config.transform ? config.transform(dto[config.field]) : dto[config.field];
            whereCondition = { [config.field]: value };
          } else {
            continue; // Skip validation if field is not provided
          }
        }

        // Check for existing entity with same unique field(s)
        const existingEntity = await this._findOne({ where: whereCondition });

        if (existingEntity && (!entityId || (existingEntity as any).id !== entityId)) {
          throw new ConflictException(config.message);
        }
      } catch (error) {
        if (error instanceof ConflictException) {
          throw error;
        }
        throw new HttpException(`Failed to validate unique constraints: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}