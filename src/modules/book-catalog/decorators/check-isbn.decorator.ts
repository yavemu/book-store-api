import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';

export function ApiCheckIsbn() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verificar existencia de ISBN - Acceso: ADMIN',
      description:
        'Verifica si un ISBN específico ya existe en el catálogo de libros. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'isbn',
      description: 'Código ISBN a verificar',
    }),
    ApiResponse({
      status: 200,
      description: 'Verificación de ISBN realizada exitosamente',
      schema: {
        type: 'object',
        properties: {
          exists: {
            type: 'boolean',
            description: 'Indica si el ISBN ya existe en el catálogo',
          },
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
  );
}
