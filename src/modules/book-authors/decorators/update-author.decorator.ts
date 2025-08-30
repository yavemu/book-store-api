import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
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
import { UpdateBookAuthorResponseDto } from '../dto';

export function ApiUpdateAuthor() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Actualizar información del autor - Acceso: ADMIN',
      description:
        'Actualiza la información de un autor existente. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del autor a actualizar',
    }),
    ApiResponse({
      status: 200,
      description: 'Autor actualizado exitosamente',
      type: UpdateBookAuthorResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos o errores de validación',
      type: BadRequestResponseDto,
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
      description: 'Autor no encontrado',
      type: NotFoundResponseDto,
    }),
    ApiConflictResponse({
      description: 'Ya existe otro autor con el mismo nombre y apellido',
      type: ConflictResponseDto,
    }),
  );
}
