/**
 * Enum para mensajes de error del módulo de roles
 */
export enum ROLE_ERROR_MESSAGES {
  FAILED_TO_CREATE = 'Error al crear el rol',
  FAILED_TO_UPDATE = 'Error al actualizar el rol',
  FAILED_TO_DELETE = 'Error al eliminar el rol',
  NOT_FOUND = 'Rol no encontrado',
  FAILED_TO_GET_ONE = 'Error al obtener el rol',
  FAILED_TO_GET_ALL = 'Error al obtener todos los roles',
  FAILED_TO_SEARCH = 'Error al buscar roles',
  FAILED_TO_FILTER = 'Error al filtrar roles',
  FAILED_TO_FIND_ACTIVE = 'Error al buscar roles activos',
  FAILED_TO_FIND_BY_PERMISSION = 'Error al buscar roles por permiso',
  FAILED_TO_FIND_BY_NAME = 'Error al buscar rol por nombre',
  NAME_ALREADY_EXISTS = 'Ya existe un rol con este nombre',
  VALIDATION_FAILED = 'Error en la validación de datos del rol',
}

/**
 * Descripción de cada mensaje de error
 */
export const ROLE_ERROR_DESCRIPTIONS = {
  [ROLE_ERROR_MESSAGES.FAILED_TO_CREATE]: 'Error interno del servidor durante la creación',
  [ROLE_ERROR_MESSAGES.FAILED_TO_UPDATE]: 'Error interno del servidor durante la actualización',
  [ROLE_ERROR_MESSAGES.FAILED_TO_DELETE]: 'Error interno del servidor durante la eliminación',
  [ROLE_ERROR_MESSAGES.NOT_FOUND]: 'El rol solicitado no existe en el sistema',
  [ROLE_ERROR_MESSAGES.FAILED_TO_GET_ONE]: 'Error interno del servidor al consultar el rol',
  [ROLE_ERROR_MESSAGES.FAILED_TO_GET_ALL]: 'Error interno del servidor al consultar roles',
  [ROLE_ERROR_MESSAGES.FAILED_TO_SEARCH]: 'Error interno del servidor durante la búsqueda',
  [ROLE_ERROR_MESSAGES.FAILED_TO_FILTER]: 'Error interno del servidor durante el filtrado',
  [ROLE_ERROR_MESSAGES.FAILED_TO_FIND_ACTIVE]:
    'Error interno del servidor al consultar roles activos',
  [ROLE_ERROR_MESSAGES.FAILED_TO_FIND_BY_PERMISSION]:
    'Error interno del servidor al buscar por permiso',
  [ROLE_ERROR_MESSAGES.FAILED_TO_FIND_BY_NAME]: 'Error interno del servidor al buscar por nombre',
  [ROLE_ERROR_MESSAGES.NAME_ALREADY_EXISTS]: 'Ya existe un rol con este nombre',
  [ROLE_ERROR_MESSAGES.VALIDATION_FAILED]: 'Los datos proporcionados no son válidos',
} as const;
