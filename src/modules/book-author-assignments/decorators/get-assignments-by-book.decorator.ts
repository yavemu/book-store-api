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
                id: { type: "string"},
                bookId: { type: "string"},
                authorId: { type: "string"},
                assignmentOrder: { type: "number"},
                createdAt: { type: "string"},
              },
            },
          },
          meta: {
            type: "object",
            properties: {
              total: { type: "number"},
              page: { type: "number"},
              limit: { type: "number"},
              totalPages: { type: "number"},
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