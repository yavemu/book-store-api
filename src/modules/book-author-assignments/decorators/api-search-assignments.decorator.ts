import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiSearchAssignments() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar asignaciones autor-libro - Acceso: ADMIN, USER',
      description: 'Busca asignaciones entre autores y libros utilizando un término de búsqueda.',
    }),
    ApiQuery({
      name: 'term',
      required: true,
      type: String,
      description: 'Término de búsqueda para asignaciones (nombre de autor o título de libro)',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número de página (por defecto: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Elementos por página (por defecto: 10)',
      example: 10,
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Campo para ordenar (por defecto: createdAt)',
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['ASC', 'DESC'],
      description: 'Orden de clasificación (por defecto: DESC)',
      example: 'DESC',
    }),
    ApiResponse({
      status: 200,
      description: 'Asignaciones encontradas exitosamente',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                bookId: { type: 'string', format: 'uuid' },
                authorId: { type: 'string', format: 'uuid' },
                book: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    title: { type: 'string' },
                    isbn: { type: 'string' },
                  },
                },
                author: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                  },
                },
                createdAt: { type: 'string', format: 'date-time' },
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