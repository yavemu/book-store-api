/**
 * Enum para mensajes de error del módulo de editoriales
 */
export enum PUBLISHING_HOUSE_ERROR_MESSAGES {
  FAILED_TO_REGISTER = 'Error al registrar la editorial',
  FAILED_TO_UPDATE = 'Error al actualizar el perfil de la editorial',
  FAILED_TO_DELETE = 'Error al desactivar la editorial',
  NOT_FOUND = 'Editorial no encontrada',
  FAILED_TO_GET_PROFILE = 'Error al obtener el perfil de la editorial',
  FAILED_TO_GET_ALL = 'Error al obtener todas las editoriales',
  FAILED_TO_SEARCH = 'Error al buscar editoriales',
  FAILED_TO_FILTER = 'Error al filtrar editoriales',
  FAILED_TO_SIMPLE_FILTER = 'Error al realizar filtro simple de editoriales',
  FAILED_TO_ADVANCED_FILTER = 'Error al realizar filtro avanzado de editoriales',
  FAILED_TO_EXPORT_CSV = 'Error al exportar editoriales a CSV',
  NAME_ALREADY_EXISTS = 'El nombre de la editorial ya existe',
  VALIDATION_FAILED = 'Error en la validación de datos de la editorial',
}

/**
 * Descripción de cada mensaje de error
 */
export const PUBLISHING_HOUSE_ERROR_DESCRIPTIONS = {
  [PUBLISHING_HOUSE_ERROR_MESSAGES.FAILED_TO_REGISTER]:
    'Error interno del servidor durante el registro',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.FAILED_TO_UPDATE]:
    'Error interno del servidor durante la actualización',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.FAILED_TO_DELETE]:
    'Error interno del servidor durante la eliminación',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.NOT_FOUND]: 'La editorial solicitada no existe en el sistema',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.FAILED_TO_GET_PROFILE]:
    'Error interno del servidor al consultar la editorial',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.FAILED_TO_GET_ALL]:
    'Error interno del servidor al consultar editoriales',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.FAILED_TO_SEARCH]:
    'Error interno del servidor durante la búsqueda',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.FAILED_TO_FILTER]:
    'Error interno del servidor durante el filtrado',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.FAILED_TO_SIMPLE_FILTER]:
    'Error interno del servidor durante el filtro simple',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.FAILED_TO_ADVANCED_FILTER]:
    'Error interno del servidor durante el filtro avanzado',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.FAILED_TO_EXPORT_CSV]:
    'Error interno del servidor durante la exportación',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.NAME_ALREADY_EXISTS]: 'Ya existe una editorial con este nombre',
  [PUBLISHING_HOUSE_ERROR_MESSAGES.VALIDATION_FAILED]: 'Los datos proporcionados no son válidos',
} as const;
