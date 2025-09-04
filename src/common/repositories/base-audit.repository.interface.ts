import { IBaseRepository } from './base.repository.interface';

/**
 * Interfaz para BaseAuditRepository - Extiende IBaseRepository
 * y añade métodos específicos para repositorios de auditoría sin logs circulares
 */
export interface IBaseAuditRepository<T> extends IBaseRepository<T> {
  // ========== MÉTODOS SIN AUDITORÍA (ESPECÍFICOS DE AUDIT REPOSITORY) ==========
  
  /**
   * Crea una entidad sin generar logs de auditoría
   * Útil para evitar logs circulares en el sistema de auditoría
   */
  createWithoutAudit(data: Partial<T>): Promise<T>;

  /**
   * Actualiza una entidad sin generar logs de auditoría
   * Útil para evitar logs circulares en el sistema de auditoría
   */
  updateWithoutAudit(id: string, data: Partial<T>): Promise<T>;

  /**
   * Elimina una entidad (soft delete) sin generar logs de auditoría
   * Útil para evitar logs circulares en el sistema de auditoría
   */
  softDeleteWithoutAudit(id: string): Promise<{ id: string }>;

  // Los siguientes métodos se heredan directamente de IBaseRepository:
  // - Todos los métodos de búsqueda (_findById, _findOne, _findMany, etc.)
  // - Métodos de validación (_validateUniqueConstraints)
  // - Métodos de transacciones (_withTransaction)
  // - Métodos de búsqueda avanzada (_findByField, _existsByField, etc.)
  // - Métodos helper (_buildPaginatedResult)
}