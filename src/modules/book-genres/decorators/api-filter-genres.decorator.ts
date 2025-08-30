import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiFilterGenres() {
  return applyDecorators(
    ApiOperation({
      summary: 'Filtrar géneros literarios - Acceso: ADMIN, USER',
      description: 'Filtra géneros literarios utilizando parámetros de consulta específicos.',
    }),
    ApiQuery({
      name: 'filter',
      required: true,
      type: String,
      description: 'Término de filtrado para géneros',
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
      example: 'name',
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['ASC', 'DESC'],
      description: 'Orden de clasificación (por defecto: DESC)',
      example: 'ASC',
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