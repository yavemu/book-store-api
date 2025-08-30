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
import {
  ApiResponseDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';

export function ApiDeleteInventoryMovement() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Eliminar movimiento del sistema - Acceso: ADMIN',
      description:
        'Realiza una eliminación lógica (soft delete) de una movimiento del sistema. La movimiento se marca como inactiva pero se preserva para auditoría. - Acceso: Solo administradores.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único de la movimiento a eliminar',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Movimiento de inventario eliminada exitosamente',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000',
                  },
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
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Movimiento de inventario no encontrada',
      type: NotFoundResponseDto,
    }),
  );
}
