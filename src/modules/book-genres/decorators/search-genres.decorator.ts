import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto';

export function ApiSearchGenres() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar géneros de libros - Acceso: ADMIN, USER',
      description: 'Busca géneros de libros por término en nombre o descripción.',
    }),
    ApiQuery({
      name: 'q',
      required: true,
      type: String,
      description: 'Término de búsqueda para filtrar géneros por nombre o descripción',
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: 'Resultados de búsqueda de géneros obtenidos exitosamente',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: {
            type: 'string',
          },
          data: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string',
                    },
                    name: { type: 'string' },
                    description: {
                      type: 'string',
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                    },
                    updatedAt: {
                      type: 'string',
                      format: 'date-time',
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
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' },
        },
      },
    }),
  );
}
