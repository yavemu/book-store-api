import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiAdvancedFilterBooks() {
  return applyDecorators(
    ApiOperation({
      summary: 'Filtro avanzado de libros del catálogo - Acceso: ADMIN, USER',
      description: 'Aplica filtros avanzados sobre el catálogo de libros con múltiples criterios de búsqueda.',
    }),
    ApiBody({
      description: 'Criterios de filtrado avanzado para libros',
      schema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Título del libro' },
          isbn: { type: 'string', description: 'ISBN del libro' },
          genreId: { type: 'string', format: 'uuid', description: 'ID del género' },
          publishingHouseId: { type: 'string', format: 'uuid', description: 'ID de la editorial' },
          minPrice: { type: 'number', description: 'Precio mínimo' },
          maxPrice: { type: 'number', description: 'Precio máximo' },
          isAvailable: { type: 'boolean', description: 'Disponibilidad' },
          publicationYear: { type: 'number', description: 'Año de publicación' },
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
      description: 'Libros filtrados obtenidos exitosamente',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                title: { type: 'string' },
                isbn: { type: 'string' },
                price: { type: 'number' },
                stockQuantity: { type: 'number' },
                isAvailable: { type: 'boolean' },
                publicationDate: { type: 'string', format: 'date' },
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