import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiSimpleFilterBooks() {
  return applyDecorators(
    ApiOperation({
      summary: 'Filtro simple de libros - Acceso: ADMIN, USER',
      description:
        'Realiza filtros parciales (LIKE %término%) con un solo término de búsqueda en múltiples campos (título, ISBN, resumen).',
    }),
    ApiQuery({
      name: 'term',
      description: 'Término parcial para buscar en múltiples campos',
      required: false,
      type: 'string',
      example: 'Harry',
    }),
    ApiQuery({
      name: 'page',
      description: 'Número de página',
      required: false,
      type: 'number',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Cantidad de elementos por página',
      required: false,
      type: 'number',
      example: 10,
    }),
    ApiQuery({
      name: 'sortBy',
      description: 'Campo por el cual ordenar',
      required: false,
      type: 'string',
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      description: 'Orden de clasificación',
      required: false,
      enum: ['ASC', 'DESC'],
      example: 'DESC',
    }),
    ApiBody({
      description: 'Criterios para filtro simple de libros (alternativo a query params)',
      required: false,
      schema: {
        type: 'object',
        properties: {
          term: {
            type: 'string',
            description: 'Término parcial para buscar en múltiples campos',
            minLength: 3,
          },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          sortBy: { type: 'string', default: 'createdAt' },
          sortOrder: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' },
        },
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
