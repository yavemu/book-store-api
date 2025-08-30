import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { InventoryMovementResponseDto } from '../dto/inventory-movement-response.dto';
import { ApiResponseDto, UnauthorizedResponseDto, ForbiddenResponseDto } from '../../../common/dto';

export function ApiGetInventoryMovements() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener lista de órdenes - Acceso: ADMIN',
      description:
        'Obtiene todas los movimientos de inventario del sistema con paginación. Incluye información de cambios realizados en el catálogo de libros. - Acceso: Solo administradores y gestores de inventario.',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número de página (por defecto: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Cantidad de elementos por página (por defecto: 10, máximo: 100)',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de órdenes obtenida exitosamente',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(InventoryMovementResponseDto) },
                  },
                  total: { type: 'number', example: 150 },
                  page: { type: 'number', example: 1 },
                  limit: { type: 'number', example: 10 },
                  totalPages: { type: 'number', example: 15 },
                },
              },
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description:
        'Acceso denegado - Se requieren permisos de administrador o gestor de inventario',
      type: ForbiddenResponseDto,
    }),
  );
}
