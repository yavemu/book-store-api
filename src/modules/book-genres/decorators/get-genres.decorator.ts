import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

export function ApiGetGenres() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener géneros de libros - Acceso: ADMIN, USER",
      description: "Obtiene una lista paginada de todos los géneros de libros disponibles en el sistema.",
    }),
    ApiQuery({
      name: "page",
      required: false,
      type: Number,
      description: "Número de página para la paginación",
      example: 1,
    }),
    ApiQuery({
      name: "limit",
      required: false,
      type: Number,
      description: "Número de elementos por página (máximo 100)",
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: "Géneros de libros obtenidos exitosamente",
      schema: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", example: "550e8400-e29b-41d4-a716-446655440000" },
                name: { type: "string", example: "Ciencia Ficción" },
                description: { type: "string", example: "Ficción que trata conceptos futuristas, ciencia y tecnología avanzada." },
                createdAt: { type: "string", example: "2024-01-01T00:00:00.000Z" },
                updatedAt: { type: "string", example: "2024-01-02T00:00:00.000Z" },
              },
            },
          },
          meta: {
            type: "object",
            properties: {
              total: { type: "number", example: 25 },
              page: { type: "number", example: 1 },
              limit: { type: "number", example: 10 },
              totalPages: { type: "number", example: 3 },
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