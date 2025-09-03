/**
 * Enum para mensajes de error del módulo de usuarios
 */
export enum USER_ERROR_MESSAGES {
  FAILED_TO_REGISTER = 'Error al registrar el usuario',
  FAILED_TO_UPDATE = 'Error al actualizar el perfil del usuario',
  FAILED_TO_DELETE = 'Error al desactivar el usuario',
  NOT_FOUND = 'Usuario no encontrado',
  FAILED_TO_GET_PROFILE = 'Error al obtener el perfil del usuario',
  FAILED_TO_GET_ALL = 'Error al obtener todos los usuarios',
  FAILED_TO_SEARCH = 'Error al buscar usuarios',
  FAILED_TO_FILTER = 'Error al filtrar usuarios',
  FAILED_TO_SIMPLE_FILTER = 'Error al realizar filtro simple de usuarios',
  FAILED_TO_ADVANCED_FILTER = 'Error al realizar filtro avanzado de usuarios',
  FAILED_TO_EXPORT_CSV = 'Error al exportar usuarios a CSV',
  USERNAME_ALREADY_EXISTS = 'El nombre de usuario ya está en uso',
  EMAIL_ALREADY_EXISTS = 'El correo electrónico ya está registrado',
  VALIDATION_FAILED = 'Error en la validación de datos del usuario',
  FAILED_TO_AUTHENTICATE = 'Error de autenticación',
}

/**
 * Descripción de cada mensaje de error
 */
export const USER_ERROR_DESCRIPTIONS = {
  [USER_ERROR_MESSAGES.FAILED_TO_REGISTER]: 'Error interno del servidor durante el registro',
  [USER_ERROR_MESSAGES.FAILED_TO_UPDATE]: 'Error interno del servidor durante la actualización',
  [USER_ERROR_MESSAGES.FAILED_TO_DELETE]: 'Error interno del servidor durante la eliminación',
  [USER_ERROR_MESSAGES.NOT_FOUND]: 'El usuario solicitado no existe en el sistema',
  [USER_ERROR_MESSAGES.FAILED_TO_GET_PROFILE]: 'Error interno del servidor al consultar el usuario',
  [USER_ERROR_MESSAGES.FAILED_TO_GET_ALL]: 'Error interno del servidor al consultar usuarios',
  [USER_ERROR_MESSAGES.FAILED_TO_SEARCH]: 'Error interno del servidor durante la búsqueda',
  [USER_ERROR_MESSAGES.FAILED_TO_FILTER]: 'Error interno del servidor durante el filtrado',
  [USER_ERROR_MESSAGES.FAILED_TO_SIMPLE_FILTER]:
    'Error interno del servidor durante el filtro simple',
  [USER_ERROR_MESSAGES.FAILED_TO_ADVANCED_FILTER]:
    'Error interno del servidor durante el filtro avanzado',
  [USER_ERROR_MESSAGES.FAILED_TO_EXPORT_CSV]: 'Error interno del servidor durante la exportación',
  [USER_ERROR_MESSAGES.USERNAME_ALREADY_EXISTS]: 'Ya existe un usuario con este nombre de usuario',
  [USER_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS]:
    'Ya existe un usuario registrado con este correo electrónico',
  [USER_ERROR_MESSAGES.VALIDATION_FAILED]: 'Los datos proporcionados no son válidos',
  [USER_ERROR_MESSAGES.FAILED_TO_AUTHENTICATE]: 'Las credenciales proporcionadas no son válidas',
} as const;
