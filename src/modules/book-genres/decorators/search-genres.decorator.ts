import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiUnauthorizedResponse, ApiExtraModels } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/dto";

export function ApiSearchGenres() {
  return applyDecorators(
    ApiOperation({
      summary: "Buscar géneros de libros - Acceso: ADMIN, USER",
      description: "Busca géneros de libros por término en nombre o descripción.",
    }),
    ApiQuery({
      name: "q",
      required: true,
      type: String,
      description: "Término de búsqueda para filtrar géneros por nombre o descripción",
      example: "ficción",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: 'Resultados de búsqueda de géneros obtenidos exitosamente',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: {
            type: 'string',
            example: 'Resultados de búsqueda de géneros obtenidos exitosamente',
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
                      example: '550e8400-e29b-41d4-a716-446655440000',
                    },
                    name: { type: 'string', example: 'Ciencia Ficción' },
                    description: {
                      type: 'string',
                      example:
                        'Ficción que trata conceptos futuristas, ciencia y tecnología avanzada.',
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-01-01T00:00:00.000Z',
                    },
                    updatedAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-01-02T00:00:00.000Z',
                    },
                  },
                },
              },
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'number', example: 5 },
                  page: { type: 'number', example: 1 },
                  limit: { type: 'number', example: 10 },
                  totalPages: { type: 'number', example: 1 },
                  hasNext: { type: 'boolean', example: false },
                  hasPrev: { type: 'boolean', example: false },
                },
              },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: "No autorizado - Token JWT inválido o faltante",
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: 401 },
          message: { type: "string", example: "No autorizado" },
        },
      },
    }),
  );
}