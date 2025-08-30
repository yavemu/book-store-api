import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
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
import { BookAuthorResponseDto } from '../dto';

export function ApiGetAuthorByName() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener autor por nombre completo - Acceso: ADMIN, USER',
      description: 'Obtiene un autor específico utilizando su nombre y apellido.',
    }),
    ApiParam({
      name: 'firstName',
      description: 'Nombre del autor',
    }),
    ApiParam({
      name: 'lastName',
      description: 'Apellido del autor',
    }),
    ApiResponse({
      status: 200,
      description: 'Autor obtenido exitosamente',
      type: BookAuthorResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Autor no encontrado',
      type: NotFoundResponseDto,
    }),
  );
}
