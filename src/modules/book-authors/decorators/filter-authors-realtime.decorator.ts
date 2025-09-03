import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { BookAuthorListResponseDto } from '../dto';
import {
  PaginationInputDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
  BadRequestResponseDto,
} from '../../../common/dto';

export function ApiFilterAuthorsRealtime() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Filtrar autores en tiempo real - Acceso: ADMIN, USER',
      description:
        'Búsqueda optimizada para filtrado en tiempo real de autores con debounce. Mínimo 3 caracteres.',
    }),
    ApiQuery({
      name: 'term',
      description: 'Término de búsqueda para filtrar autores (mínimo 3 caracteres)',
      required: true,
      type: String,
    }),
    ApiQuery({ type: PaginationInputDto }),
    ApiResponse({
      status: 200,
      description: 'Lista paginada de autores filtrados',
      type: BookAuthorListResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Error de validación - término de búsqueda muy corto',
      type: BadRequestResponseDto,
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
