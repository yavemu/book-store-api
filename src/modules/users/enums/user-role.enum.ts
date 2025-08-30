/**
 * Enum para definir los roles de usuario en el sistema
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

/**
 * Descripción de permisos por rol
 */
export const USER_ROLE_DESCRIPTIONS = {
  [UserRole.ADMIN]: 'Administrador con acceso completo al sistema',
  [UserRole.USER]: 'Usuario regular con permisos básicos',
} as const;

/**
 * Lista de todos los roles disponibles
 */
export const USER_ROLES = Object.values(UserRole);
