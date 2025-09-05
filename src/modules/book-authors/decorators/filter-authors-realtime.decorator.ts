import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UnauthorizedResponseDto, ForbiddenResponseDto } from '../../../common/dto';
import { BookAuthorListResponseDto } from '../dto';

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
      example: 'garcia',
    }),
    ApiQuery({
      name: 'page',
      description: 'Número de página',
      required: false,
      type: Number,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Límite de resultados por página (máximo 50)',
      required: false,
      type: Number,
      example: 20,
    }),
    ApiResponse({
      status: 200,
      description: 'Lista paginada de autores filtrados',
      type: BookAuthorListResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Error de validación - término de búsqueda muy corto',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Filter term must be at least 3 characters long' },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT requerido',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Prohibido - Acceso restringido',
      type: ForbiddenResponseDto,
    }),
  );
}
