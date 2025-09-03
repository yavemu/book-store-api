/**
 * Enum para mensajes de error del módulo de autores
 */
export enum BOOK_AUTHOR_ERROR_MESSAGES {
  FAILED_TO_CREATE = 'Error al crear el autor',
  FAILED_TO_UPDATE = 'Error al actualizar el autor',
  FAILED_TO_DELETE = 'Error al eliminar el autor',
  NOT_FOUND = 'Autor no encontrado',
  FAILED_TO_GET_ONE = 'Error al obtener el autor',
  FAILED_TO_GET_ALL = 'Error al obtener todos los autores',
  FAILED_TO_SEARCH = 'Error al buscar autores',
  FAILED_TO_FILTER = 'Error al filtrar autores',
  FAILED_TO_SIMPLE_FILTER = 'Error al realizar filtro simple de autores',
  FAILED_TO_ADVANCED_FILTER = 'Error al realizar filtro avanzado de autores',
  FAILED_TO_EXPORT_CSV = 'Error al exportar autores a CSV',
  FAILED_TO_SEARCH_BY_NAME = 'Error al buscar autores por nombre',
  FILTER_TERM_REQUIRED = 'El término de filtro es requerido',
  EMAIL_ALREADY_EXISTS = 'Ya existe un autor con este correo electrónico',
  NAME_ALREADY_EXISTS = 'Ya existe un autor con este nombre',
  VALIDATION_FAILED = 'Error en la validación de datos del autor',
}

/**
 * Descripción de cada mensaje de error
 */
export const BOOK_AUTHOR_ERROR_DESCRIPTIONS = {
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_CREATE]: 'Error interno del servidor durante la creación',
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_UPDATE]:
    'Error interno del servidor durante la actualización',
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_DELETE]:
    'Error interno del servidor durante la eliminación',
  [BOOK_AUTHOR_ERROR_MESSAGES.NOT_FOUND]: 'El autor solicitado no existe en el sistema',
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_GET_ONE]:
    'Error interno del servidor al consultar el autor',
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_GET_ALL]: 'Error interno del servidor al consultar autores',
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_SEARCH]: 'Error interno del servidor durante la búsqueda',
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_FILTER]: 'Error interno del servidor durante el filtrado',
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_SIMPLE_FILTER]:
    'Error interno del servidor durante el filtro simple',
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_ADVANCED_FILTER]:
    'Error interno del servidor durante el filtro avanzado',
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_EXPORT_CSV]:
    'Error interno del servidor durante la exportación',
  [BOOK_AUTHOR_ERROR_MESSAGES.FAILED_TO_SEARCH_BY_NAME]:
    'Error interno del servidor al buscar por nombre',
  [BOOK_AUTHOR_ERROR_MESSAGES.FILTER_TERM_REQUIRED]: 'Debe proporcionar un término de búsqueda',
  [BOOK_AUTHOR_ERROR_MESSAGES.EMAIL_ALREADY_EXISTS]:
    'Ya existe un autor registrado con este correo electrónico',
  [BOOK_AUTHOR_ERROR_MESSAGES.NAME_ALREADY_EXISTS]: 'Ya existe un autor con este nombre y apellido',
  [BOOK_AUTHOR_ERROR_MESSAGES.VALIDATION_FAILED]: 'Los datos proporcionados no son válidos',
} as const;
