/**
 * Enum para mensajes de error del módulo de catálogo de libros
 */
export enum BOOK_CATALOG_ERROR_MESSAGES {
  FAILED_TO_REGISTER = 'Error al registrar el libro',
  FAILED_TO_UPDATE = 'Error al actualizar el perfil del libro',
  FAILED_TO_DELETE = 'Error al desactivar el libro',
  NOT_FOUND = 'Libro no encontrado',
  FAILED_TO_GET_PROFILE = 'Error al obtener el perfil del libro',
  FAILED_TO_GET_ALL = 'Error al obtener todos los libros',
  FAILED_TO_SEARCH = 'Error al buscar libros',
  FAILED_TO_FILTER = 'Error al filtrar libros',
  FAILED_TO_SIMPLE_FILTER = 'Error al realizar filtro simple de libros',
  FAILED_TO_ADVANCED_FILTER = 'Error al realizar filtro avanzado de libros',
  FAILED_TO_EXPORT_CSV = 'Error al exportar libros a CSV',
  ISBN_ALREADY_EXISTS = 'El código ISBN ya existe',
  VALIDATION_FAILED = 'Error en la validación de datos del libro',
}

/**
 * Descripción de cada mensaje de error
 */
export const BOOK_CATALOG_ERROR_DESCRIPTIONS = {
  [BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_REGISTER]:
    'Error interno del servidor durante el registro',
  [BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_UPDATE]:
    'Error interno del servidor durante la actualización',
  [BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_DELETE]:
    'Error interno del servidor durante la eliminación',
  [BOOK_CATALOG_ERROR_MESSAGES.NOT_FOUND]: 'El libro solicitado no existe en el sistema',
  [BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_GET_PROFILE]:
    'Error interno del servidor al consultar el libro',
  [BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_GET_ALL]: 'Error interno del servidor al consultar libros',
  [BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_SEARCH]: 'Error interno del servidor durante la búsqueda',
  [BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_FILTER]: 'Error interno del servidor durante el filtrado',
  [BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_SIMPLE_FILTER]:
    'Error interno del servidor durante el filtro simple',
  [BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_ADVANCED_FILTER]:
    'Error interno del servidor durante el filtro avanzado',
  [BOOK_CATALOG_ERROR_MESSAGES.FAILED_TO_EXPORT_CSV]:
    'Error interno del servidor durante la exportación',
  [BOOK_CATALOG_ERROR_MESSAGES.ISBN_ALREADY_EXISTS]: 'Ya existe un libro con este código ISBN',
  [BOOK_CATALOG_ERROR_MESSAGES.VALIDATION_FAILED]: 'Los datos proporcionados no son válidos',
} as const;
