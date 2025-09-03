/**
 * Enum para mensajes de error del módulo de movimientos de inventario
 */
export enum INVENTORY_MOVEMENT_ERROR_MESSAGES {
  FAILED_TO_CREATE = 'Error al crear el movimiento de inventario',
  FAILED_TO_UPDATE = 'Error al actualizar el movimiento de inventario',
  FAILED_TO_DELETE = 'Error al eliminar el movimiento de inventario',
  NOT_FOUND = 'Movimiento de inventario no encontrado',
  FAILED_TO_GET_ONE = 'Error al obtener el movimiento de inventario',
  FAILED_TO_GET_ALL = 'Error al obtener todos los movimientos de inventario',
  FAILED_TO_SEARCH = 'Error al buscar movimientos de inventario',
  FAILED_TO_FILTER = 'Error al filtrar movimientos de inventario',
  FAILED_TO_SIMPLE_FILTER = 'Error al realizar filtro simple de movimientos',
  FAILED_TO_ADVANCED_FILTER = 'Error al realizar filtro avanzado de movimientos',
  FAILED_TO_EXPORT_CSV = 'Error al exportar movimientos de inventario a CSV',
  FAILED_TO_CREATE_PENDING = 'Error al crear movimiento de inventario pendiente',
  FAILED_TO_MARK_COMPLETED = 'Error al marcar movimiento como completado',
  FAILED_TO_MARK_FAILED = 'Error al marcar movimiento como fallido',
  INVALID_STATUS = 'Estado de movimiento inválido',
  INVALID_TYPE = 'Tipo de movimiento inválido',
  VALIDATION_FAILED = 'Error en la validación de datos del movimiento',
}

/**
 * Descripción de cada mensaje de error
 */
export const INVENTORY_MOVEMENT_ERROR_DESCRIPTIONS = {
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_CREATE]:
    'Error interno del servidor durante la creación',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_UPDATE]:
    'Error interno del servidor durante la actualización',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_DELETE]:
    'Error interno del servidor durante la eliminación',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.NOT_FOUND]: 'El movimiento solicitado no existe en el sistema',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_GET_ONE]:
    'Error interno del servidor al consultar el movimiento',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_GET_ALL]:
    'Error interno del servidor al consultar movimientos',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_SEARCH]:
    'Error interno del servidor durante la búsqueda',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_FILTER]:
    'Error interno del servidor durante el filtrado',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_SIMPLE_FILTER]:
    'Error interno del servidor durante el filtro simple',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_ADVANCED_FILTER]:
    'Error interno del servidor durante el filtro avanzado',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_EXPORT_CSV]:
    'Error interno del servidor durante la exportación',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_CREATE_PENDING]:
    'Error interno del servidor al crear movimiento pendiente',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_MARK_COMPLETED]:
    'Error interno del servidor al completar movimiento',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.FAILED_TO_MARK_FAILED]:
    'Error interno del servidor al marcar movimiento fallido',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.INVALID_STATUS]: 'El estado proporcionado no es válido',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.INVALID_TYPE]:
    'El tipo de movimiento proporcionado no es válido',
  [INVENTORY_MOVEMENT_ERROR_MESSAGES.VALIDATION_FAILED]: 'Los datos proporcionados no son válidos',
} as const;
