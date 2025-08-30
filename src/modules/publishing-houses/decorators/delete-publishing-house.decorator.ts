import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';
import { DeletePublishingHouseResponseDto } from '../dto';

export function ApiDeletePublishingHouse() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Eliminar editorial del sistema - Acceso: ADMIN',
      description:
        'Elimina una editorial del sistema (eliminación lógica). Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único de la editorial a eliminar',
    }),
    ApiResponse({
      status: 200,
      description: 'Editorial eliminada exitosamente',
      type: DeletePublishingHouseResponseDto,
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
      description: 'Editorial no encontrada',
      type: NotFoundResponseDto,
    }),
  );
}
