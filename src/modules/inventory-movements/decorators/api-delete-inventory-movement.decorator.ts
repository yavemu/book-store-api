import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function ApiDeleteInventoryMovement() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiTags('InventoryMovements'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Desactivar una movimiento - Acceso: ADMIN',
      description:
        'Desactiva (eliminación suave) una movimiento específica del sistema. La movimiento no se elimina físicamente sino que se marca como inactiva.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID único de la movimiento a desactivar (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
      status: 200,
      description: 'Movimiento de inventario desactivada exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '550e8400-e29b-41d4-a716-446655440000',
            description: 'ID de la movimiento desactivada',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado - Token JWT faltante o inválido',
    }),
    ApiResponse({
      status: 403,
      description: 'Prohibido - Sin permisos suficientes',
    }),
    ApiResponse({
      status: 404,
      description: 'Movimiento de inventario no encontrada',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor',
    }),
  );
}
