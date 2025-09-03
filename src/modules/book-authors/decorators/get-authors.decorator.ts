import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { BookAuthorListResponseDto } from '../dto';
import {
  PaginationInputDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
} from '../../../common/dto';

export function ApiGetAuthors() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener lista de autores - Acceso: ADMIN, USER',
      description:
        'Obtiene una lista paginada de todos los autores registrados con filtros opcionales. Endpoint público.',
    }),
    ApiQuery({ type: PaginationInputDto }),
    ApiResponse({
      status: 200,
      description: 'Lista de autores obtenida exitosamente',
      type: BookAuthorListResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos válidos',
      type: ForbiddenResponseDto,
    }),
  );
}
