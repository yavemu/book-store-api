import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function ApiGetInventoryMovementById() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiTags('InventoryMovements'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obtener una movimiento por ID - Acceso: ADMIN, USER',
      description: 'Recupera los detalles de una movimiento específica mediante su ID único.',
    }),
    ApiParam({
      name: 'id',
      type: 'string',
      description: 'ID único de la movimiento (UUID)',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
      status: 200,
      description: 'Movimiento de inventario encontrada y devuelta exitosamente',
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
