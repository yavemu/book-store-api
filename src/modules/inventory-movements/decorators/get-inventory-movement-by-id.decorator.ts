import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { InventoryMovementResponseDto } from '../dto/inventory-movement-response.dto';
import {
  ApiResponseDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';

export function ApiGetInventoryMovementById() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener movimiento por ID - Acceso: ADMIN',
      description:
        'Obtiene los detalles de una movimiento específica mediante su ID único. Incluye información completa de la transacción y cambios realizados. - Acceso: Solo administradores y gestores de inventario.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único de la movimiento',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Movimiento de inventario encontrada exitosamente',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(InventoryMovementResponseDto) },
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
    ApiNotFoundResponse({
      description: 'Movimiento de inventario no encontrada',
      type: NotFoundResponseDto,
    }),
  );
}
