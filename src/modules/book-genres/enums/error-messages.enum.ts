/**
 * Enum para mensajes de error del módulo de géneros de libros
 */
export enum BOOK_GENRE_ERROR_MESSAGES {
  FAILED_TO_REGISTER = 'Error al registrar el género',
  FAILED_TO_UPDATE = 'Error al actualizar el perfil del género',
  FAILED_TO_DELETE = 'Error al desactivar el género',
  NOT_FOUND = 'Género no encontrado',
  FAILED_TO_GET_PROFILE = 'Error al obtener el perfil del género',
  FAILED_TO_GET_ALL = 'Error al obtener todos los géneros',
  FAILED_TO_SEARCH = 'Error al buscar géneros',
  FAILED_TO_FILTER = 'Error al filtrar géneros',
  FAILED_TO_SIMPLE_FILTER = 'Error al realizar filtro simple de géneros',
  FAILED_TO_ADVANCED_FILTER = 'Error al realizar filtro avanzado de géneros',
  FAILED_TO_EXPORT_CSV = 'Error al exportar géneros a CSV',
  NAME_ALREADY_EXISTS = 'El nombre del género ya existe',
  VALIDATION_FAILED = 'Error en la validación de datos del género',
  FAILED_TO_CHECK_NAME_EXISTS = 'Error al verificar la existencia del nombre del género',
}

/**
 * Descripción de cada mensaje de error
 */
export const BOOK_GENRE_ERROR_DESCRIPTIONS = {
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_REGISTER]: 'Error interno del servidor durante el registro',
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_UPDATE]:
    'Error interno del servidor durante la actualización',
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_DELETE]: 'Error interno del servidor durante la eliminación',
  [BOOK_GENRE_ERROR_MESSAGES.NOT_FOUND]: 'El género solicitado no existe en el sistema',
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_GET_PROFILE]:
    'Error interno del servidor al consultar el género',
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_GET_ALL]: 'Error interno del servidor al consultar géneros',
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_SEARCH]: 'Error interno del servidor durante la búsqueda',
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_FILTER]: 'Error interno del servidor durante el filtrado',
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_SIMPLE_FILTER]:
    'Error interno del servidor durante el filtro simple',
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_ADVANCED_FILTER]:
    'Error interno del servidor durante el filtro avanzado',
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_EXPORT_CSV]:
    'Error interno del servidor durante la exportación',
  [BOOK_GENRE_ERROR_MESSAGES.NAME_ALREADY_EXISTS]: 'Ya existe un género con este nombre',
  [BOOK_GENRE_ERROR_MESSAGES.VALIDATION_FAILED]: 'Los datos proporcionados no son válidos',
  [BOOK_GENRE_ERROR_MESSAGES.FAILED_TO_CHECK_NAME_EXISTS]:
    'Error interno del servidor al validar unicidad del nombre',
} as const;
