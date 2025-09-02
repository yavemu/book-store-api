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
import { UserRole } from '../../../common/enums/user-role.enum';

export function ApiFilterUsersRealtime() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Filtrar usuarios en tiempo real - Acceso: ADMIN, USER',
      description:
        'Búsqueda optimizada para filtrado en tiempo real con debounce. Mínimo 3 caracteres. ACCESO: Solo administradores.',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'filter',
      description: 'Término de búsqueda para filtrar usuarios (mínimo 3 caracteres)',
      required: true,
      type: String,
      example: 'juan',
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
      description: 'Lista paginada de usuarios filtrados',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-123' },
                username: { type: 'string', example: 'juan_perez' },
                email: { type: 'string', example: 'juan.perez@example.com' },
                role: {
                  type: 'object',
                  properties: { name: { type: 'string', example: UserRole.USER } },
                },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 25 },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 20 },
              totalPages: { type: 'number', example: 2 },
              hasNext: { type: 'boolean', example: true },
              hasPrev: { type: 'boolean', example: false },
            },
          },
        },
      },
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
      description: 'Prohibido - Solo administradores pueden filtrar usuarios',
      type: ForbiddenResponseDto,
    }),
  );
}
