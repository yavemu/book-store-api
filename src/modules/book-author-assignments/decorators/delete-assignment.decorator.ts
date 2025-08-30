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

export function ApiDeleteAssignment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar asignación autor-libro - Acceso: ADMIN',
      description:
        'Elimina (soft delete) una asignación entre un libro y un autor. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID de la asignación libro-autor a eliminar',
    }),
    ApiResponse({
      status: 200,
      description: 'Asignación libro-autor eliminada exitosamente',
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
      description: 'Asignación no encontrada',
      type: NotFoundResponseDto,
    }),
  );
}
