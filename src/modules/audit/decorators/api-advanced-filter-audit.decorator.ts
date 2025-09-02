import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiAdvancedFilterAudit() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Filtro avanzado de logs de auditoría - Acceso: ADMIN',
      description:
        'Aplica filtros avanzados sobre los logs de auditoría del sistema con múltiples criterios.',
    }),
    ApiBody({
      description: 'Criterios de filtrado avanzado para logs de auditoría',
      schema: {
        type: 'object',
        properties: {
          userId: { type: 'string', format: 'uuid', description: 'ID del usuario' },
          entityType: { type: 'string', description: 'Tipo de entidad' },
          action: { type: 'string', description: 'Acción realizada' },
          startDate: { type: 'string', format: 'date', description: 'Fecha de inicio' },
          endDate: { type: 'string', format: 'date', description: 'Fecha de fin' },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'number', minimum: 1 },
              limit: { type: 'number', minimum: 1, maximum: 100 },
              sortBy: { type: 'string', default: 'timestamp' },
              sortOrder: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Logs de auditoría filtrados obtenidos exitosamente',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                userId: { type: 'string', format: 'uuid' },
                entityId: { type: 'string', format: 'uuid' },
                entityType: { type: 'string' },
                action: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
              totalPages: { type: 'number' },
              hasNext: { type: 'boolean' },
              hasPrev: { type: 'boolean' },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
    }),
    ApiBearerAuth(),
  );
}
