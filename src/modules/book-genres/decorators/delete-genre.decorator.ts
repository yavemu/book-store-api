import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';

export function ApiDeleteGenre() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar género de libro - Acceso: ADMIN',
      description:
        'Elimina (soft delete) un género de libro del sistema. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID único del género de libro a eliminar',
    }),
    ApiResponse({
      status: 200,
      description: 'Género de libro eliminado exitosamente',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
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
      description: 'Género no encontrado',
      type: NotFoundResponseDto,
    }),
  );
}
