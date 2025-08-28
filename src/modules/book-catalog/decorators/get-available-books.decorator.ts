import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse, ApiExtraModels } from "@nestjs/swagger";
import { BookCatalogListResponseDto } from '../dto';
import { PaginationDto } from "../../../common/dto/pagination.dto";

export function ApiGetAvailableBooks() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener libros disponibles - Acceso: ADMIN, USER",
      description: "Obtiene una lista paginada de libros disponibles para compra en el catálogo.",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Libros disponibles obtenidos exitosamente",
      type: BookCatalogListResponseDto,
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