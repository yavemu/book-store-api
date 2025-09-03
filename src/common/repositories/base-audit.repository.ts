import { Repository, FindManyOptions } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';

export abstract class BaseAuditRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  // ========== MÉTODOS PRIVADOS COMUNES SIN AUDITORÍA ==========

  protected async _createWithoutAudit(data: Partial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data as any);
      const savedEntity = await this.repository.save(entity as T);
      return savedEntity;
    } catch (_error) {
      throw new HttpException('Failed to create audit entity', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findByIdWithoutAudit(id: string): Promise<T | null> {
    try {
      return await this.repository.findOne({ where: { id } as any });
    } catch (_error) {
      return null;
    }
  }

  protected async _findOneWithoutAudit(options: any): Promise<T | null> {
    try {
      return await this.repository.findOne(options);
    } catch (_error) {
      return null;
    }
  }

  protected async _findManyWithoutAudit(options: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (_error) {
      throw new HttpException('Failed to find audit entities', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findManyWithPaginationWithoutAudit(
    options: FindManyOptions<T>,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<T>> {
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
    } catch (_error) {
      throw new HttpException(
        'Failed to find audit entities with pagination',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  protected async _updateWithoutAudit(id: string, data: Partial<T>): Promise<T> {
    try {
      await this.repository.update({ id } as any, data as any);
      const updatedEntity = await this._findByIdWithoutAudit(id);
      return updatedEntity;
    } catch (_error) {
      throw new HttpException('Failed to update audit entity', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _softDeleteWithoutAudit(id: string): Promise<{ id: string }> {
    try {
      await this.repository.softDelete({ id } as any);
      return { id };
    } catch (_error) {
      throw new HttpException('Failed to delete audit entity', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _countWithoutAudit(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.repository.count(options);
    } catch (_error) {
      throw new HttpException('Failed to count audit entities', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _existsWithoutAudit(options: any): Promise<boolean> {
    try {
      const count = await this.repository.count(options);
      return count > 0;
    } catch (_error) {
      throw new HttpException(
        'Failed to check audit entity existence',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ========== MÉTODO HELPER PARA PAGINACIÓN MANUAL ==========

  protected _buildPaginatedResultWithoutAudit(
    data: T[],
    total: number,
    pagination: PaginationDto,
  ): PaginatedResult<T> {
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
  }
}
