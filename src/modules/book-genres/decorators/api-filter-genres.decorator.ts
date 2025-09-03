import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookGenreListResponseDto } from '../dto';
import {
  PaginationInputDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
} from '../../../common/dto';

export function ApiFilterGenres() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Filtrar géneros literarios - Acceso: ADMIN, USER',
      description: 'Filtra géneros literarios utilizando parámetros de consulta específicos.',
    }),
    ApiQuery({
      name: 'term',
      required: true,
      type: String,
      description: 'Término de filtrado para géneros',
    }),
    ApiQuery({ type: PaginationInputDto }),
    ApiResponse({
      status: 200,
      description: 'Géneros filtrados obtenidos exitosamente',
      type: BookGenreListResponseDto,
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
