import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ForbiddenResponseDto } from '../../../common/dto';

export function ApiFilterAuditRealtime() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Filtrar registros de auditoría en tiempo real - Acceso: ADMIN',
      description:
        'Búsqueda optimizada para filtrado en tiempo real de logs de auditoría con debounce y paginación. Mínimo 3 caracteres requeridos. - Acceso: Solo administradores.',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'filter',
      description: 'Término de búsqueda para filtrar auditorías (mínimo 3 caracteres)',
      required: true,
      type: String,
      example: 'usuario',
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
      description: 'Lista paginada de registros de auditoría filtrados',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-123' },
                action: { type: 'string', example: 'CREATE' },
                entityType: { type: 'string', example: 'User' },
                entityId: { type: 'string', example: 'user-uuid-456' },
                performedBy: { type: 'string', example: 'admin-uuid-789' },
                details: { type: 'string', example: 'Usuario creado exitosamente' },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 150 },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 20 },
              totalPages: { type: 'number', example: 8 },
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
    }),
    ApiForbiddenResponse({
      description: 'Prohibido - Solo administradores pueden acceder a logs de auditoría',
    }),
  );
}
