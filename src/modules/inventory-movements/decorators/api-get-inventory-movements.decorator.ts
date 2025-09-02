import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function ApiGetInventoryMovements() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiTags('InventoryMovements'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obtener todas los movimientos de inventario con paginación - Acceso: ADMIN, USER',
      description:
        'Recupera una lista paginada de todas los movimientos de inventario del sistema.',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: 'number',
      description: 'Número de página (por defecto: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: 'number',
      description: 'Cantidad de elementos por página (por defecto: 10)',
      example: 10,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: 'string',
      description: 'Campo por el cual movimientoar (por defecto: createdAt)',
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortInventoryMovement',
      required: false,
      enum: ['ASC', 'DESC'],
      description: 'Movimiento de inventario de clasificación (por defecto: DESC)',
      example: 'DESC',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de órdenes recuperada exitosamente',
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
      status: 500,
      description: 'Error interno del servidor',
    }),
  );
}
