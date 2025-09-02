import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiProduces } from '@nestjs/swagger';

export function ApiExportInventoryMovementsCsv() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Exportar movimientos de inventario a CSV - Acceso: ADMIN, USER',
      description: `
        Exporta los movimientos de inventario en formato CSV aplicando filtros obligatorios.
        
        Control de acceso por rol:
        - ADMIN: puede exportar todos los movimientos o filtrar por usuario específico
        - USER: solo sus propios movimientos
        
        IMPORTANTE: Al menos un filtro es obligatorio (filters, search o advancedFilters debe contener al menos un parámetro).
        
        Control de acceso por rol:
        - USER: Solo puede exportar sus propios movimientos, independientemente de los filtros aplicados
        - ADMIN: Puede exportar todos los movimientos o filtrar por usuario específico usando filters.userId
      `,
    }),
    ApiBody({
      description: 'Filtros para la exportación (al menos un filtro es obligatorio)',
      schema: {
        type: 'object',
        required: ['filters'],
        properties: {
          filters: {
            type: 'object',
            description: 'Filtros básicos (obligatorio)',
            properties: {
              movementType: {
                type: 'string',
                enum: ['CREATE', 'UPDATE', 'DELETE'],
                description: 'Tipo de movimiento',
              },
              status: {
                type: 'string',
                enum: ['PENDING', 'COMPLETED', 'ERROR'],
                description: 'Estado del movimiento',
              },
              entityType: { type: 'string', description: 'Tipo de entidad afectada' },
              entityId: {
                type: 'string',
                format: 'uuid',
                description: 'ID de la entidad afectada',
              },
              userId: {
                type: 'string',
                format: 'uuid',
                description: 'ID del usuario (solo ADMIN)',
              },
              userRole: { type: 'string', description: 'Rol del usuario' },
              startDate: {
                type: 'string',
                format: 'date',
                description: 'Fecha de inicio (YYYY-MM-DD)',
              },
              endDate: { type: 'string', format: 'date', description: 'Fecha de fin (YYYY-MM-DD)' },
              isActive: { type: 'boolean', description: 'Estado activo/inactivo' },
            },
          },
          search: {
            type: 'object',
            description: 'Búsquedas de texto (opcional)',
            properties: {
              searchTerm: {
                type: 'string',
                description: 'Término de búsqueda general (notas, usuario, entidad)',
              },
              userFullName: { type: 'string', description: 'Búsqueda por nombre de usuario' },
              notes: { type: 'string', description: 'Búsqueda en notas' },
            },
          },
          advancedFilters: {
            type: 'object',
            description: 'Filtros avanzados por rangos numéricos (opcional)',
            properties: {
              minPriceBefore: { type: 'number', description: 'Precio anterior mínimo' },
              maxPriceBefore: { type: 'number', description: 'Precio anterior máximo' },
              minPriceAfter: { type: 'number', description: 'Precio posterior mínimo' },
              maxPriceAfter: { type: 'number', description: 'Precio posterior máximo' },
              minQuantityBefore: { type: 'number', description: 'Cantidad anterior mínima' },
              maxQuantityBefore: { type: 'number', description: 'Cantidad anterior máxima' },
              minQuantityAfter: { type: 'number', description: 'Cantidad posterior mínima' },
              maxQuantityAfter: { type: 'number', description: 'Cantidad posterior máxima' },
            },
          },
        },
      },
    }),
    ApiProduces('text/csv'),
    ApiResponse({
      status: 200,
      description: 'Archivo CSV generado exitosamente',
      content: {
        'text/csv': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      headers: {
        'Content-Type': {
          description: 'Tipo de contenido',
          schema: { type: 'string', example: 'text/csv' },
        },
        'Content-Disposition': {
          description: 'Disposición del contenido para descarga',
          schema: { type: 'string', example: 'attachment; filename="movimientos-inventario.csv"' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Datos de entrada inválidos o filtros insuficientes',
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado - Token requerido',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
    ApiBearerAuth(),
  );
}
