import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';

export function ApiCheckAssignment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verificar existencia de asignación - Acceso: ADMIN, USER',
      description: 'Verifica si existe una asignación entre un libro y un autor específicos.',
    }),
    ApiParam({
      name: 'bookId',
      description: 'ID del libro a verificar',
    }),
    ApiParam({
      name: 'authorId',
      description: 'ID del autor a verificar',
    }),
    ApiResponse({
      status: 200,
      description: 'Verificación de asignación realizada exitosamente',
      schema: {
        type: 'object',
        properties: {
          exists: {
            type: 'boolean',
            description: 'Indica si existe la asignación entre el libro y el autor',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiBearerAuth(),
  );
}
