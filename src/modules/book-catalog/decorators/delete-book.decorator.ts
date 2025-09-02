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
import { DeleteBookCatalogResponseDto } from '../dto';
import {
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';

export function ApiDeleteBook() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Eliminar libro del catálogo - Acceso: ADMIN',
      description:
        'Elimina un libro del catálogo del sistema mediante eliminación lógica, preservando registros históricos. - Acceso: Solo administradores.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del libro a eliminar',
    }),
    ApiResponse({
      status: 200,
      description: 'Libro eliminado exitosamente del catálogo',
      type: DeleteBookCatalogResponseDto,
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
      description: 'Libro no encontrado en el catálogo',
      type: NotFoundResponseDto,
    }),
  );
}
