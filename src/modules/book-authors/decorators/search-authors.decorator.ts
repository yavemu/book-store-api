import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookAuthorExactSearchDto, BookAuthorListResponseDto } from '../dto';
import {
  PaginationInputDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
} from '../../../common/dto';

export function ApiSearchAuthors() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Buscar autores - Acceso: ADMIN, USER',
      description: 'Busca autores por datos completos usando criterios exactos.',
    }),
    ApiBody({ type: BookAuthorExactSearchDto }),
    ApiQuery({ type: PaginationInputDto }),
    ApiResponse({
      status: 200,
      description: 'Resultados de búsqueda de autores obtenidos exitosamente',
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
