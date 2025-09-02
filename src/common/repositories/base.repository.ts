import { Repository, FindManyOptions } from 'typeorm';
import { HttpException, HttpStatus, ConflictException, Inject } from '@nestjs/common';
import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';
import {
  IAuditLoggerService,
  EnhancedAuditData,
} from '../../modules/audit/interfaces/audit-logger.service.interface';
import { AuditAction } from '../../modules/audit/enums/audit-action.enum';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly repository: Repository<T>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService?: IAuditLoggerService,
  ) {}

  // ========== MÉTODOS PRIVADOS COMUNES ==========

  protected async _create(
    data: Partial<T>,
    performedBy: string,
    entityName: string,
    getDescription?: (entity: T) => string,
    action: AuditAction.CREATE | AuditAction.REGISTER = AuditAction.CREATE,
  ): Promise<T> {
    try {
      const entity = this.repository.create(data as any);
      const savedEntity = await this.repository.save(entity as T);

      if (performedBy && entityName) {
        await this._logAudit(
          action,
          (savedEntity as any).id,
          performedBy,
          entityName,
          getDescription,
        );
      }

      return savedEntity;
    } catch (_error) {
      throw new HttpException('Failed to create entity', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findById(id: string): Promise<T | null> {
    try {
      return await this.repository.findOne({ where: { id } as any });
    } catch (_error) {
      // Only throw 500 for actual database/system errors
      // If entity simply doesn't exist, return null and let the service handle it
      return null;
    }
  }

  protected async _findOne(options: any): Promise<T | null> {
    try {
      return await this.repository.findOne(options);
    } catch (_error) {
      // Only throw 500 for actual database/system errors
      // If entity simply doesn't exist, return null and let the service handle it
      return null;
    }
  }

  protected async _findMany(options: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.repository.find(options);
    } catch (_error) {
      throw new HttpException('Failed to find entities', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _findManyWithPagination(
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
        'Failed to find entities with pagination',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  protected async _update(
    id: string,
    data: Partial<T>,
    performedBy?: string,
    entityName?: string,
    getDescription?: (entity: T) => string,
  ): Promise<T> {
    try {
      await this.repository.update({ id } as any, data as any);

      if (performedBy && entityName) {
        await this._logAudit(AuditAction.UPDATE, id, performedBy, entityName, getDescription);
      }
      const updatedEntity = await this._findById(id);
      return updatedEntity;
    } catch (_error) {
      throw new HttpException('Failed to update entity', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _softDelete(
    id: string,
    performedBy?: string,
    entityName?: string,
    getDescription?: (entity: T) => string,
  ): Promise<{ id: string }> {
    try {
      const entity = performedBy && entityName && getDescription ? await this._findById(id) : null;
      await this.repository.softDelete({ id } as any);

      if (performedBy && entityName) {
        const description = entity && getDescription ? getDescription(entity) : undefined;
        await this._logAudit(
          AuditAction.DELETE,
          id,
          performedBy,
          entityName,
          description ? () => description : undefined,
        );
      }

      return { id };
    } catch (_error) {
      throw new HttpException('Failed to delete entity', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _count(options?: FindManyOptions<T>): Promise<number> {
    try {
      return await this.repository.count(options);
    } catch (_error) {
      throw new HttpException('Failed to count entities', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  protected async _exists(options: any): Promise<boolean> {
    try {
      const count = await this.repository.count(options);
      return count > 0;
    } catch (_error) {
      throw new HttpException('Failed to check entity existence', HttpStatus.INTERNAL_SERVER_ERROR);
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
            const value = config.transform
              ? config.transform(dto[config.field])
              : dto[config.field];
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
        throw new HttpException(
          `Failed to validate unique constraints: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  // ========== MÉTODO CENTRALIZADO DE AUDITORÍA MEJORADO ==========

  protected async _logAudit(
    action: AuditAction,
    entityId: string,
    performedBy: string,
    entityName: string,
    getDescription?: (entity: T) => string,
    result: string = 'SUCCESS',
    ipAddress?: string,
    errorDetails?: string,
  ): Promise<void> {
    if (this.auditLogService) {
      const startTime = Date.now();

      try {
        let description: string;
        let entitySnapshot: Record<string, any> | undefined;

        // Construir descripción y snapshot de entidad
        if (
          getDescription &&
          entityId &&
          action !== AuditAction.DELETE &&
          action !== AuditAction.LOGIN &&
          action !== AuditAction.REGISTER &&
          result === 'SUCCESS'
        ) {
          const entity = await this._findById(entityId);
          if (entity) {
            description = getDescription(entity);
            entitySnapshot = JSON.parse(JSON.stringify(entity));
          } else {
            description = `${action.toLowerCase()} ${entityName}`;
          }
        } else {
          description = getDescription
            ? getDescription({} as T)
            : `${action.toLowerCase()} ${entityName}`;
        }

        const executionTime = Date.now() - startTime;

        // Usar el nuevo método mejorado
        const auditData: EnhancedAuditData = {
          performedBy,
          entityId,
          action,
          details: description,
          entityType: entityName,
          result,
          ipAddress,
          environment: process.env.NODE_ENV || 'development',
          processId: process.pid,
          executionContext: `${entityName}Repository`,
          entitySnapshot,
          executionTimeMs: executionTime,
          errorDetails: result !== 'SUCCESS' ? errorDetails : undefined,
        };

        await this.auditLogService.logEnhanced(auditData);
      } catch (auditError) {
        // Si falla el logging de auditoría, no debe afectar la operación principal
        console.error('Failed to log audit:', auditError);
      }
    }
  }

  // Método auxiliar para logging de errores
  protected async _logError(
    action: AuditAction,
    performedBy: string,
    entityName: string,
    errorMessage: string,
    ipAddress?: string,
  ): Promise<void> {
    if (this.auditLogService) {
      try {
        await this.auditLogService.logError(
          performedBy,
          action,
          entityName,
          errorMessage,
          ipAddress,
          `${entityName}Repository`,
        );
      } catch (auditError) {
        console.error('Failed to log error audit:', auditError);
      }
    }
  }

  // ========== MÉTODO HELPER PARA PAGINACIÓN MANUAL ==========

  protected _buildPaginatedResult(
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
