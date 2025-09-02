import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

export function ApiSearchInventoryMovements() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Buscar movimientos de inventario con filtros avanzados - Acceso: ADMIN, USER',
      description: `
        Busca movimientos de inventario aplicando filtros, búsquedas de texto y filtros avanzados.
        
        Control de acceso por rol:
        - ADMIN: puede ver todos los movimientos o filtrar por usuario específico
        - USER: solo sus propios movimientos
        
        Control de acceso por rol:
        - USER: Solo puede ver sus propios movimientos, independientemente de los filtros aplicados
        - ADMIN: Puede ver todos los movimientos o filtrar por usuario específico usando filters.userId
      `,
    }),
    ApiBody({
      description: 'Criterios de búsqueda y paginación',
      schema: {
        type: 'object',
        required: ['pagination'],
        properties: {
          pagination: {
            type: 'object',
            required: ['page', 'limit'],
            properties: {
              page: { type: 'number', minimum: 1, description: 'Número de página' },
              limit: {
                type: 'number',
                minimum: 1,
                maximum: 100,
                description: 'Elementos por página',
              },
              sortBy: { type: 'string', default: 'createdAt', description: 'Campo para ordenar' },
              sortOrder: {
                type: 'string',
                enum: ['ASC', 'DESC'],
                default: 'DESC',
                description: 'Orden de clasificación',
              },
            },
          },
          filters: {
            type: 'object',
            description: 'Filtros básicos',
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
            description: 'Búsquedas de texto',
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
            description: 'Filtros avanzados por rangos numéricos',
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
    ApiResponse({
      status: 200,
      description: 'Búsqueda completada exitosamente',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    entityType: { type: 'string' },
                    entityId: { type: 'string', format: 'uuid' },
                    movementType: { type: 'string', enum: ['CREATE', 'UPDATE', 'DELETE'] },
                    status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'ERROR'] },
                    userId: { type: 'string', format: 'uuid' },
                    userFullName: { type: 'string' },
                    userRole: { type: 'string' },
                    priceBefore: { type: 'number' },
                    priceAfter: { type: 'number' },
                    quantityBefore: { type: 'number' },
                    quantityAfter: { type: 'number' },
                    notes: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
              meta: {
                type: 'object',
                properties: {
                  totalItems: { type: 'number' },
                  itemCount: { type: 'number' },
                  itemsPerPage: { type: 'number' },
                  totalPages: { type: 'number' },
                  currentPage: { type: 'number' },
                },
              },
            },
          },
          message: { type: 'string' },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Datos de entrada inválidos',
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
