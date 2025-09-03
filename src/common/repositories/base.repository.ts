import { Repository, FindManyOptions, QueryRunner, DataSource } from 'typeorm';
import { HttpException, HttpStatus, ConflictException, Inject } from '@nestjs/common';
import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';
import {
  IAuditLoggerService,
  EnhancedAuditData,
} from '../interfaces';
import { AuditAction } from '../../modules/audit/enums/audit-action.enum';

export abstract class BaseRepository<T> {
  constructor(
    protected readonly repository: Repository<T>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService?: IAuditLoggerService,
  ) {}

  protected get dataSource(): DataSource {
    return this.repository.manager.connection;
  }

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

  // ========== MÉTODO HELPER PARA TRANSACCIONES ==========
  protected async _withTransaction<TResult>(
    operation: (queryRunner: QueryRunner) => Promise<TResult>,
    performedBy?: string,
    entityName?: string,
    operationName: string = 'transaction',
  ): Promise<TResult> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Conectar el QueryRunner
      await queryRunner.connect();

      // Iniciar la transacción
      await queryRunner.startTransaction();

      // Log de inicio de transacción para auditoría
      if (performedBy && entityName) {
        await this._logTransactionStart(performedBy, entityName, operationName);
      }

      // Ejecutar la operación dentro de la transacción
      const result = await operation(queryRunner);

      // Si llegamos aquí, todo salió bien - hacer commit
      await queryRunner.commitTransaction();

      // Log de éxito de transacción para auditoría
      if (performedBy && entityName) {
        await this._logTransactionSuccess(performedBy, entityName, operationName);
      }

      return result;
    } catch (error) {
      // Si hay error, hacer rollback
      try {
        await queryRunner.rollbackTransaction();
      } catch (rollbackError) {
        // Si el rollback también falla, logear el error pero mantener el error original
        console.error('Failed to rollback transaction:', rollbackError);
      }

      // Log de error de transacción para auditoría
      if (performedBy && entityName) {
        await this._logTransactionError(
          performedBy,
          entityName,
          operationName,
          error instanceof Error ? error.message : 'Unknown error',
        );
      }

      // Re-lanzar el error original
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Transaction failed during ${operationName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      // Siempre liberar el QueryRunner
      try {
        await queryRunner.release();
      } catch (releaseError) {
        // Si falla la liberación, solo logear pero no lanzar error
        console.error('Failed to release query runner:', releaseError);
      }
    }
  }

  /**
   * Método helper para crear un repositorio usando el QueryRunner de una transacción.
   * Útil cuando necesitas trabajar con repositorios específicos dentro de una transacción.
   *
   * @param queryRunner - QueryRunner activo de la transacción
   * @param entityClass - Clase de la entidad para la cual crear el repositorio
   * @returns Repository configurado para usar el QueryRunner
   */
  protected _getTransactionalRepository<TEntity>(
    queryRunner: QueryRunner,
    entityClass: new () => TEntity,
  ): Repository<TEntity> {
    return queryRunner.manager.getRepository(entityClass);
  }

  // ========== MÉTODOS PRIVADOS PARA AUDITORÍA DE TRANSACCIONES ==========

  private async _logTransactionStart(
    performedBy: string,
    entityName: string,
    operationName: string,
  ): Promise<void> {
    try {
      if (this.auditLogService) {
        const auditData: EnhancedAuditData = {
          performedBy,
          entityId: 'N/A',
          action: AuditAction.UPDATE, // Usando UPDATE como acción genérica para transacciones
          details: `Iniciando transacción: ${operationName}`,
          entityType: entityName,
          result: 'STARTED',
          environment: process.env.NODE_ENV || 'development',
          processId: process.pid,
          executionContext: `${entityName}Repository.transaction`,
          executionTimeMs: 0,
        };

        await this.auditLogService.logEnhanced(auditData);
      }
    } catch (auditError) {
      console.error('Failed to log transaction start:', auditError);
    }
  }

  private async _logTransactionSuccess(
    performedBy: string,
    entityName: string,
    operationName: string,
  ): Promise<void> {
    try {
      if (this.auditLogService) {
        const auditData: EnhancedAuditData = {
          performedBy,
          entityId: 'N/A',
          action: AuditAction.UPDATE,
          details: `Transacción completada exitosamente: ${operationName}`,
          entityType: entityName,
          result: 'SUCCESS',
          environment: process.env.NODE_ENV || 'development',
          processId: process.pid,
          executionContext: `${entityName}Repository.transaction`,
          executionTimeMs: 0,
        };

        await this.auditLogService.logEnhanced(auditData);
      }
    } catch (auditError) {
      console.error('Failed to log transaction success:', auditError);
    }
  }

  private async _logTransactionError(
    performedBy: string,
    entityName: string,
    operationName: string,
    errorMessage: string,
  ): Promise<void> {
    try {
      if (this.auditLogService) {
        await this.auditLogService.logError(
          performedBy,
          AuditAction.UPDATE,
          entityName,
          `Error en transacción ${operationName}: ${errorMessage}`,
          undefined,
          `${entityName}Repository.transaction`,
        );
      }
    } catch (auditError) {
      console.error('Failed to log transaction error:', auditError);
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

  // ========== MÉTODO GENÉRICO PARA BUSCAR POR CAMPO ==========

  /**
   * Método genérico e inteligente para buscar entidades por campo.
   * Automáticamente excluye el ID cuando es apropiado (operaciones de update/delete).
   *
   * @param field - Nombre del campo por el cual buscar
   * @param value - Valor a buscar
   * @param options - Opciones de búsqueda
   * @returns Entidad encontrada o null
   */
  protected async _findByField(
    field: keyof T | string,
    value: any,
    options: {
      excludeId?: string;
      transform?: (value: any) => any;
      additionalWhere?: Record<string, any>;
      relations?: string[];
      caseSensitive?: boolean;
    } = {},
  ): Promise<T | null> {
    try {
      // Aplicar transformación por defecto para strings si no es case sensitive
      let processedValue = value;
      if (typeof value === 'string' && !options.caseSensitive) {
        processedValue = options.transform ? options.transform(value) : value.toLowerCase().trim();
      } else if (options.transform) {
        processedValue = options.transform(value);
      }

      // Construir condiciones WHERE
      const whereCondition: any = {
        [field as string]: processedValue,
        ...options.additionalWhere,
      };

      // Inteligentemente excluir ID si se proporciona
      if (options.excludeId) {
        whereCondition.id = { not: options.excludeId } as any;
      }

      const findOptions: any = {
        where: whereCondition,
      };

      // Agregar relaciones si se especifican
      if (options.relations && options.relations.length > 0) {
        findOptions.relations = options.relations;
      }

      return await this._findOne(findOptions);
    } catch (error) {
      // Log error but don't throw to maintain consistency with other _find methods
      console.error(`Error in _findByField for field ${String(field)}:`, error);
      return null;
    }
  }

  /**
   * Método de conveniencia para verificar si existe una entidad por campo.
   * Útil para validaciones de unicidad.
   *
   * @param field - Nombre del campo
   * @param value - Valor a verificar
   * @param excludeId - ID a excluir de la búsqueda (útil para updates)
   * @param transform - Función para transformar el valor antes de buscar
   * @returns true si existe, false si no
   */
  protected async _existsByField(
    field: keyof T | string,
    value: any,
    excludeId?: string,
    transform?: (value: any) => any,
  ): Promise<boolean> {
    const entity = await this._findByField(field, value, {
      excludeId,
      transform,
    });
    return entity !== null;
  }

  /**
   * Método para búsqueda por múltiples campos (compound unique constraints).
   *
   * @param fields - Objeto con los campos y valores
   * @param options - Opciones de búsqueda
   * @returns Entidad encontrada o null
   */
  protected async _findByFields(
    fields: Partial<Record<keyof T, any>>,
    options: {
      excludeId?: string;
      relations?: string[];
      transforms?: Partial<Record<keyof T, (value: any) => any>>;
      caseSensitive?: boolean;
    } = {},
  ): Promise<T | null> {
    try {
      const whereCondition: any = {};

      // Procesar cada campo
      for (const [field, value] of Object.entries(fields)) {
        if (value !== undefined && value !== null) {
          let processedValue = value;

          // Aplicar transformación específica del campo o por defecto
          if (options.transforms && options.transforms[field as keyof T]) {
            processedValue = options.transforms[field as keyof T]!(value);
          } else if (typeof value === 'string' && !options.caseSensitive) {
            processedValue = value.toLowerCase().trim();
          }

          whereCondition[field] = processedValue;
        }
      }

      // Excluir ID si se especifica
      if (options.excludeId) {
        whereCondition.id = { not: options.excludeId } as any;
      }

      const findOptions: any = {
        where: whereCondition,
      };

      if (options.relations && options.relations.length > 0) {
        findOptions.relations = options.relations;
      }

      return await this._findOne(findOptions);
    } catch (error) {
      console.error('Error in _findByFields:', error);
      return null;
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
