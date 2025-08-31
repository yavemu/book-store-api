export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export const USER_ROLE_DESCRIPTIONS = {
  [UserRole.ADMIN]: 'Administrador con acceso completo al sistema',
  [UserRole.USER]: 'Usuario regular con permisos básicos',
} as const;

export const USER_ROLES = Object.values(UserRole);
