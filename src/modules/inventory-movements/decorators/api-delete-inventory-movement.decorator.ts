import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiTags,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { DeleteInventoryMovementResponseDto } from '../dto/inventory-movement-response.dto';
import { UnauthorizedResponseDto, NotFoundResponseDto, ForbiddenResponseDto } from '../../../common/dto';

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
      type: DeleteInventoryMovementResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT faltante o inválido',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Prohibido - Sin permisos suficientes',
      type: ForbiddenResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Movimiento de inventario no encontrada',
      type: NotFoundResponseDto,
    }),
  );
}
