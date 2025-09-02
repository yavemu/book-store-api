import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiTags,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetInventoryMovementResponseDto } from '../dto/inventory-movement-response.dto';
import { UnauthorizedResponseDto, NotFoundResponseDto } from '../../../common/dto';

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
      type: GetInventoryMovementResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT faltante o inválido',
      type: UnauthorizedResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Movimiento de inventario no encontrada',
      type: NotFoundResponseDto,
    }),
  );
}
