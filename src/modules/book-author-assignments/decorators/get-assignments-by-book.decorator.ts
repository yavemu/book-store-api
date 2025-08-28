import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiUnauthorizedResponse, ApiExtraModels } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/dto/pagination.dto";

export function ApiGetAssignmentsByBook() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener asignaciones por libro - Acceso: ADMIN, USER",
      description: "Obtiene todas las asignaciones de autores para un libro específico.",
    }),
    ApiParam({
      name: "bookId",
      description: "ID del libro para filtrar asignaciones",
      example: "550e8400-e29b-41d4-a716-446655440001",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Asignaciones del libro especificado obtenidas exitosamente",
      schema: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", example: "550e8400-e29b-41d4-a716-446655440000" },
                bookId: { type: "string", example: "550e8400-e29b-41d4-a716-446655440001" },
                authorId: { type: "string", example: "550e8400-e29b-41d4-a716-446655440002" },
                assignmentOrder: { type: "number", example: 1 },
                createdAt: { type: "string", example: "2024-01-01T00:00:00.000Z" },
              },
            },
          },
          meta: {
            type: "object",
            properties: {
              total: { type: "number", example: 5 },
              page: { type: "number", example: 1 },
              limit: { type: "number", example: 10 },
              totalPages: { type: "number", example: 1 },
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