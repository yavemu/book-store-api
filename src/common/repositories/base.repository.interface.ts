import { QueryRunner, FindManyOptions } from 'typeorm';
import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';
import { AuditAction } from '../../modules/audit/enums/audit-action.enum';

/**
 * Interfaz para BaseRepository - Define todos los métodos disponibles
 * en el repositorio base con auditoría integrada
 */
export interface IBaseRepository<T> {
  // ========== MÉTODOS CRUD BÁSICOS ==========
  _create(
    data: Partial<T>,
    performedBy: string,
    entityName: string,
    getDescription?: (entity: T) => string,
    action?: AuditAction.CREATE | AuditAction.REGISTER,
  ): Promise<T>;

  _findById(id: string): Promise<T | null>;

  _findOne(options: any): Promise<T | null>;

  _findMany(options: FindManyOptions<T>): Promise<T[]>;

  _findManyWithPagination(
    options: FindManyOptions<T>,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<T>>;

  _update(
    id: string,
    data: Partial<T>,
    performedBy?: string,
    entityName?: string,
    getDescription?: (entity: T) => string,
  ): Promise<T>;

  _softDelete(
    id: string,
    performedBy?: string,
    entityName?: string,
    getDescription?: (entity: T) => string,
  ): Promise<{ id: string }>;

  _count(options?: FindManyOptions<T>): Promise<number>;

  _exists(options: any): Promise<boolean>;

  // ========== MÉTODOS DE VALIDACIÓN ==========
  _validateUniqueConstraints(
    dto: any,
    entityId?: string,
    uniqueFields?: Array<{
      field: string | string[];
      message: string;
      transform?: (value: any) => any;
    }>,
  ): Promise<void>;

  // ========== MÉTODOS DE TRANSACCIONES ==========
  _withTransaction<TResult>(
    operation: (queryRunner: QueryRunner) => Promise<TResult>,
    performedBy?: string,
    entityName?: string,
    operationName?: string,
  ): Promise<TResult>;

  _getTransactionalRepository<TEntity>(
    queryRunner: QueryRunner,
    entityClass: new () => TEntity,
  ): import('typeorm').Repository<TEntity>;

  // ========== MÉTODOS DE BÚSQUEDA AVANZADA ==========
  _findByField(
    field: keyof T | string,
    value: any,
    options?: {
      excludeId?: string;
      transform?: (value: any) => any;
      additionalWhere?: Record<string, any>;
      relations?: string[];
      caseSensitive?: boolean;
    },
  ): Promise<T | null>;

  _existsByField(
    field: keyof T | string,
    value: any,
    excludeId?: string,
    transform?: (value: any) => any,
  ): Promise<boolean>;

  _findByFields(
    fields: Partial<Record<keyof T, any>>,
    options?: {
      excludeId?: string;
      relations?: string[];
      transforms?: Partial<Record<keyof T, (value: any) => any>>;
      caseSensitive?: boolean;
    },
  ): Promise<T | null>;

  // ========== MÉTODOS HELPER ==========
  _buildPaginatedResult(
    data: T[],
    total: number,
    pagination: PaginationDto,
  ): PaginatedResult<T>;
}