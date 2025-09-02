import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';
import { BookAuthorResponseDto } from '../dto';

export function ApiGetAuthorById() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener autor por ID - Acceso: ADMIN, USER',
      description:
        'Obtiene los detalles completos de un autor específico usando su ID único. Endpoint público.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del autor',
    }),
    ApiResponse({
      status: 200,
      description: 'Autor encontrado y devuelto exitosamente',
      type: BookAuthorResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Autor no encontrado',
      type: NotFoundResponseDto,
    }),
    ApiBearerAuth(),
  );
}
