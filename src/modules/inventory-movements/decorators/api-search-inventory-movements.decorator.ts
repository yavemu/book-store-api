import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

export function ApiSearchInventoryMovements() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Filtro simple de movimientos de inventario - Acceso: ADMIN, USER',
      description: `
        Realiza filtros parciales (LIKE %término%) con un solo término de búsqueda en múltiples campos.
        
        Control de acceso por rol:
        - ADMIN: puede ver todos los movimientos
        - USER: solo sus propios movimientos
      `,
    }),
    ApiQuery({
      name: 'term',
      description: 'Término parcial para buscar en múltiples campos (notas, tipo de movimiento, tipo de entidad)',
      required: false,
      type: 'string',
      example: 'libro',
    }),
    ApiQuery({
      name: 'page',
      description: 'Número de página',
      required: false,
      type: 'number',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Cantidad de elementos por página',
      required: false,
      type: 'number',
      example: 10,
    }),
    ApiQuery({
      name: 'sortBy',
      description: 'Campo por el cual ordenar',
      required: false,
      type: 'string',
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      description: 'Orden de clasificación',
      required: false,
      enum: ['ASC', 'DESC'],
      example: 'DESC',
    }),
    ApiResponse({
      status: 200,
      description: 'Movimientos filtrados obtenidos exitosamente',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                entityType: { type: 'string' },
                entityId: { type: 'string', format: 'uuid' },
                movementType: { type: 'string' },
                status: { type: 'string' },
                notes: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
              totalPages: { type: 'number' },
              hasNext: { type: 'boolean' },
              hasPrev: { type: 'boolean' },
            },
          },
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
