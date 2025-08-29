import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse, ApiExtraModels } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/dto";

export function ApiGetGenres() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener géneros de libros - Acceso: ADMIN, USER",
      description: "Obtiene una lista paginada de todos los géneros de libros disponibles en el sistema.",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: 'Géneros de libros obtenidos exitosamente',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean'},
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
                    name: { type: 'string'},
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
                  total: { type: 'number'},
                  page: { type: 'number'},
                  limit: { type: 'number'},
                  totalPages: { type: 'number'},
                  hasNext: { type: 'boolean'},
                  hasPrev: { type: 'boolean'},
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
          statusCode: { type: "number"},
          message: { type: "string"},
        },
      },
    }),
  );
}