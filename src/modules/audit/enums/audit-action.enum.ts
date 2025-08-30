/**
 * Enum para definir las acciones de auditoría en el sistema
 */
export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  READ = 'READ',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

/**
 * Descripción de cada acción de auditoría
 */
export const AUDIT_ACTION_DESCRIPTIONS = {
  [AuditAction.CREATE]: 'Creación de una nueva entidad',
  [AuditAction.UPDATE]: 'Actualización de una entidad existente',
  [AuditAction.DELETE]: 'Eliminación de una entidad',
  [AuditAction.READ]: 'Consulta de una entidad',
  [AuditAction.LOGIN]: 'Inicio de sesión de usuario',
  [AuditAction.REGISTER]: 'Registro de nuevo usuario',
} as const;

/**
 * Lista de todas las acciones de auditoría disponibles
 */
export const AUDIT_ACTIONS = Object.values(AuditAction);
