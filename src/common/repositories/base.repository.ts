import { Repository, FindManyOptions } from 'typeorm';
import { HttpException, HttpStatus, ConflictException, Inject, Injectable } from '@nestjs/common';
import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';
import { IAuditLogService } from '../../modules/audit/interfaces/audit-log.service.interface';
import { AuditAction } from '../../modules/audit/enums/audit-action.enum';
import { SuccessResponseDto } from '../dto/success-response.dto';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly repository: Repository<T>,
    @Inject('IAuditLogService')
    protected readonly auditLogService?: IAuditLogService
  ) {}

  // ========== MÉTODOS PRIVADOS COMUNES ==========

  protected async _createEntity(
    data: Partial<T>,
    successMessage: string,
    performedBy?: string,
    entityName?: string,
    getDescription?: (entity: T) => string,
  ): Promise<SuccessResponseDto<T>> {
    try {
      const entity = this.repository.create(data as any);
      const savedEntity = await this.repository.save(entity as T);

      if (performedBy && entityName) {
        await this._logAudit(
          AuditAction.CREATE,
          (savedEntity as any).id,
          performedBy,
          entityName,
          getDescription,
        );
      }

      return new SuccessResponseDto(successMessage, savedEntity);
    } catch (error) {
      throw new HttpException(
        'Failed to create entity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

  protected async _updateEntity(
    id: string,
    data: Partial<T>,
    successMessage: string,
    performedBy?: string,
    entityName?: string,
    getDescription?: (entity: T) => string,
  ): Promise<SuccessResponseDto<T>> {
    try {
      await this.repository.update({ id } as any, data as any);

      if (performedBy && entityName) {
        await this._logAudit(
          AuditAction.UPDATE,
          id,
          performedBy,
          entityName,
          getDescription,
        );
      }
      const updatedEntity = await this._findById(id);
      return new SuccessResponseDto(successMessage, updatedEntity);
    } catch (error) {
      throw new HttpException(
        'Failed to update entity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  protected async _softDelete(
    id: string,
    successMessage: string,
    performedBy?: string,
    entityName?: string,
    getDescription?: (entity: T) => string,
  ): Promise<SuccessResponseDto<{ id: string }>> {
    try {
      const entity =
        performedBy && entityName && getDescription
          ? await this._findById(id)
          : null;
      await this.repository.softDelete({ id } as any);

      if (performedBy && entityName) {
        const description =
          entity && getDescription ? getDescription(entity) : undefined;
        await this._logAudit(
          AuditAction.DELETE,
          id,
          performedBy,
          entityName,
          description ? () => description : undefined,
        );
      }
      return new SuccessResponseDto(successMessage, { id });
    } catch (error) {
      throw new HttpException(
        'Failed to delete entity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

  // ========== MÉTODO CENTRALIZADO DE AUDITORÍA ==========

  protected async _logAudit(
    action: AuditAction,
    entityId: string,
    performedBy: string,
    entityName: string,
    getDescription?: (entity: T) => string
  ): Promise<void> {
    if (this.auditLogService) {
      let description: string;
      
      if (getDescription && action !== AuditAction.DELETE) {
        const entity = await this._findById(entityId);
        description = entity ? getDescription(entity) : `${action.toLowerCase()} ${entityName}`;
      } else {
        description = getDescription ? getDescription({} as T) : `${action.toLowerCase()} ${entityName}`;
      }
      
      await this.auditLogService.logOperation(
        performedBy,
        entityId,
        action,
        description,
        entityName
      );
    }
  }
}