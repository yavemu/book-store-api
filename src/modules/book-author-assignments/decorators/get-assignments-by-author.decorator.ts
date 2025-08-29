import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiUnauthorizedResponse, ApiExtraModels } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/dto";

export function ApiGetAssignmentsByAuthor() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener asignaciones por autor - Acceso: ADMIN, USER",
      description: "Obtiene todas las asignaciones de libros para un autor específico.",
    }),
    ApiParam({
      name: "authorId",
      description: "ID del autor para filtrar asignaciones",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Asignaciones del autor especificado obtenidas exitosamente",
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