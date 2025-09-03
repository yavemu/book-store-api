import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { BookExactSearchDto, BookCatalogListResponseDto } from '../dto';
import {
  PaginationInputDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
} from '../../../common/dto';

export function ApiExactSearchBooks() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Búsqueda exacta de libros - Acceso: ADMIN, USER',
      description:
        'Realiza búsquedas exactas (WHERE campo = valor) en campos específicos del catálogo de libros.',
    }),
    ApiBody({
      description: 'Criterios para búsqueda exacta de libros',
      type: BookExactSearchDto,
    }),
    ApiQuery({ type: PaginationInputDto }),
    ApiResponse({
      status: 200,
      description: 'Libros encontrados con búsqueda exacta exitosamente',
      type: BookCatalogListResponseDto,
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
