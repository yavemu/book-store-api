import { Repository, FindManyOptions } from 'typeorm';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';
import { BaseRepository } from './base.repository';
import { IAuditLoggerService } from '../interfaces';

export abstract class BaseAuditRepository<T> extends BaseRepository<T> {
  constructor(
    protected readonly repository: Repository<T>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService?: IAuditLoggerService,
  ) {
    // Pasar null como auditLogService al padre para evitar logs circulares
    super(repository, null);
  }

  // ========== MÉTODOS PÚBLICOS SIN AUDITORÍA (HEREDA DE BASE) ==========
  
  // BaseAuditRepository usa los métodos del padre BaseRepository
  // pero sin generar logs de auditoría para evitar circularidad
  
  // Método de conveniencia: crear sin auditoría
  protected async createWithoutAudit(data: Partial<T>): Promise<T> {
    // Usa el método _create del padre pero sin performedBy (no genera audit)
    return await this._create(data, null, null);
  }

  // Método de conveniencia: update sin auditoría  
  protected async updateWithoutAudit(id: string, data: Partial<T>): Promise<T> {
    // Usa el método _update del padre pero sin performedBy (no genera audit)
    return await this._update(id, data, null, null);
  }

  // Método de conveniencia: soft delete sin auditoría
  protected async softDeleteWithoutAudit(id: string): Promise<{ id: string }> {
    // Usa el método _softDelete del padre pero sin performedBy (no genera audit)
    return await this._softDelete(id, null, null);
  }

  // Los demás métodos se heredan directamente del BaseRepository:
  // - _findById, _findOne, _findMany, _findManyWithPagination
  // - _count, _exists, _validateUniqueConstraints
  // - _withTransaction, _findByField, _existsByField, _findByFields
  // - _buildPaginatedResult
}
