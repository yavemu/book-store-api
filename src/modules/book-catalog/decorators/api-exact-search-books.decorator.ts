import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiExactSearchBooks() {
  return applyDecorators(
    ApiOperation({
      summary: 'Búsqueda exacta de libros - Acceso: ADMIN, USER',
      description:
        'Realiza búsquedas exactas (WHERE campo = valor) en campos específicos del catálogo de libros.',
    }),
    ApiBody({
      description: 'Criterios para búsqueda exacta de libros',
      schema: {
        type: 'object',
        properties: {
          searchField: {
            type: 'string',
            enum: ['title', 'isbnCode', 'author', 'genre', 'publisher'],
            description: 'Campo específico donde buscar exactamente',
          },
          searchValue: {
            type: 'string',
            description: 'Valor exacto a buscar',
          },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          sortBy: { type: 'string', default: 'createdAt' },
          sortOrder: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' },
        },
        required: ['searchField', 'searchValue'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Libros encontrados con búsqueda exacta exitosamente',
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
                isbnCode: { type: 'string' },
                price: { type: 'number' },
                stockQuantity: { type: 'number' },
                isAvailable: { type: 'boolean' },
                publicationDate: { type: 'string', format: 'date' },
                genre: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                  },
                },
                publisher: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                  },
                },
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
