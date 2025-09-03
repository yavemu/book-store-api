import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { BookCatalogListResponseDto } from '../dto';
import {
  PaginationInputDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
} from '../../../common/dto';

export function ApiSimpleFilterBooks() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Filtro simple de libros - Acceso: ADMIN, USER',
      description:
        'Realiza filtros parciales (LIKE %término%) con un solo término de búsqueda en múltiples campos (título, ISBN, resumen).',
    }),
    ApiQuery({
      name: 'term',
      description: 'Término parcial para buscar en múltiples campos',
      required: false,
      type: String,
    }),
    ApiQuery({ type: PaginationInputDto }),
    ApiResponse({
      status: 200,
      description: 'Libros filtrados obtenidos exitosamente',
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
