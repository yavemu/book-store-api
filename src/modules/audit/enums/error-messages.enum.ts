/**
 * Enum para mensajes de error del módulo de auditoría
 */
export enum AUDIT_ERROR_MESSAGES {
  FAILED_TO_GET_ALL = 'Error al obtener todos los registros de auditoría',
  NOT_FOUND = 'Registro de auditoría no encontrado',
  FAILED_TO_GET_ONE = 'Error al obtener el registro de auditoría',
  FAILED_TO_DELETE = 'Error al eliminar el registro de auditoría',
  FAILED_TO_EXPORT_CSV = 'Error al exportar registros de auditoría a CSV',
  FAILED_TO_SEARCH = 'Error al buscar registros de auditoría',
  FAILED_TO_FILTER = 'Error al filtrar registros de auditoría',
  FAILED_TO_SIMPLE_FILTER = 'Error al realizar filtro simple',
  FAILED_TO_ADVANCED_FILTER = 'Error al realizar filtro avanzado',
}

/**
 * Descripción de cada mensaje de error
 */
export const AUDIT_ERROR_DESCRIPTIONS = {
  [AUDIT_ERROR_MESSAGES.FAILED_TO_GET_ALL]:
    'Error interno del servidor al consultar registros de auditoría',
  [AUDIT_ERROR_MESSAGES.NOT_FOUND]: 'El registro de auditoría solicitado no existe',
  [AUDIT_ERROR_MESSAGES.FAILED_TO_GET_ONE]:
    'Error interno del servidor al consultar un registro específico',
  [AUDIT_ERROR_MESSAGES.FAILED_TO_DELETE]: 'Error interno del servidor al eliminar registro',
  [AUDIT_ERROR_MESSAGES.FAILED_TO_EXPORT_CSV]: 'Error interno del servidor durante la exportación',
  [AUDIT_ERROR_MESSAGES.FAILED_TO_SEARCH]: 'Error interno del servidor durante la búsqueda',
  [AUDIT_ERROR_MESSAGES.FAILED_TO_FILTER]: 'Error interno del servidor durante el filtrado',
  [AUDIT_ERROR_MESSAGES.FAILED_TO_SIMPLE_FILTER]:
    'Error interno del servidor durante el filtro simple',
  [AUDIT_ERROR_MESSAGES.FAILED_TO_ADVANCED_FILTER]:
    'Error interno del servidor durante el filtro avanzado',
} as const;
