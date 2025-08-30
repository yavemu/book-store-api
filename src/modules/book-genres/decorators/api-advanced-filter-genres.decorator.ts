import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiAdvancedFilterGenres() {
  return applyDecorators(
    ApiOperation({
      summary: 'Filtro avanzado de géneros literarios - Acceso: ADMIN, USER',
      description: 'Aplica filtros avanzados sobre los géneros literarios con múltiples criterios.',
    }),
    ApiBody({
      description: 'Criterios de filtrado avanzado para géneros',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Nombre del género' },
          description: { type: 'string', description: 'Descripción del género' },
          isActive: { type: 'boolean', description: 'Estado activo/inactivo' },
          createdDateStart: { type: 'string', format: 'date', description: 'Fecha de creación desde' },
          createdDateEnd: { type: 'string', format: 'date', description: 'Fecha de creación hasta' },
          pagination: {
            type: 'object',
            required: ['page', 'limit'],
            properties: {
              page: { type: 'number', minimum: 1 },
              limit: { type: 'number', minimum: 1, maximum: 100 },
              sortBy: { type: 'string', default: 'createdAt' },
              sortOrder: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' },
            },
          },
        },
        required: ['pagination'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Géneros filtrados obtenidos exitosamente',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                description: { type: 'string' },
                isActive: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
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