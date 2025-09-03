/**
 * Enum para mensajes de error del módulo de asignaciones libro-autor
 */
export enum BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES {
  FAILED_TO_CREATE = 'Error al crear la asignación libro-autor',
  FAILED_TO_UPDATE = 'Error al actualizar la asignación libro-autor',
  FAILED_TO_DELETE = 'Error al eliminar la asignación libro-autor',
  NOT_FOUND = 'Asignación libro-autor no encontrada',
  FAILED_TO_GET_ONE = 'Error al obtener la asignación libro-autor',
  FAILED_TO_GET_ALL = 'Error al obtener todas las asignaciones libro-autor',
  FAILED_TO_SEARCH = 'Error al buscar asignaciones libro-autor',
  FAILED_TO_FILTER = 'Error al filtrar asignaciones libro-autor',
  FAILED_TO_SIMPLE_FILTER = 'Error al realizar filtro simple de asignaciones',
  FAILED_TO_ADVANCED_FILTER = 'Error al realizar filtro avanzado de asignaciones',
  FAILED_TO_EXPORT_CSV = 'Error al exportar asignaciones a CSV',
  ASSIGNMENT_ALREADY_EXISTS = 'Ya existe esta asignación libro-autor',
  BOOK_NOT_FOUND = 'El libro especificado no existe',
  AUTHOR_NOT_FOUND = 'El autor especificado no existe',
  VALIDATION_FAILED = 'Error en la validación de datos de la asignación',
}

/**
 * Descripción de cada mensaje de error
 */
export const BOOK_AUTHOR_ASSIGNMENT_ERROR_DESCRIPTIONS = {
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.FAILED_TO_CREATE]:
    'Error interno del servidor durante la creación',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.FAILED_TO_UPDATE]:
    'Error interno del servidor durante la actualización',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.FAILED_TO_DELETE]:
    'Error interno del servidor durante la eliminación',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.NOT_FOUND]:
    'La asignación solicitada no existe en el sistema',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.FAILED_TO_GET_ONE]:
    'Error interno del servidor al consultar la asignación',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.FAILED_TO_GET_ALL]:
    'Error interno del servidor al consultar asignaciones',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.FAILED_TO_SEARCH]:
    'Error interno del servidor durante la búsqueda',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.FAILED_TO_FILTER]:
    'Error interno del servidor durante el filtrado',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.FAILED_TO_SIMPLE_FILTER]:
    'Error interno del servidor durante el filtro simple',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.FAILED_TO_ADVANCED_FILTER]:
    'Error interno del servidor durante el filtro avanzado',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.FAILED_TO_EXPORT_CSV]:
    'Error interno del servidor durante la exportación',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.ASSIGNMENT_ALREADY_EXISTS]:
    'Ya existe una asignación entre este libro y autor',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.BOOK_NOT_FOUND]:
    'El libro especificado no existe en el sistema',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.AUTHOR_NOT_FOUND]:
    'El autor especificado no existe en el sistema',
  [BOOK_AUTHOR_ASSIGNMENT_ERROR_MESSAGES.VALIDATION_FAILED]:
    'Los datos proporcionados no son válidos',
} as const;
