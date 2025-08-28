import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiUnauthorizedResponse, ApiExtraModels } from "@nestjs/swagger";
import { BookCatalogListResponseDto, BookFiltersDto } from '../dto';
import { PaginationDto } from "../../../common/dto/pagination.dto";

export function ApiFilterBooks() {
  return applyDecorators(
    ApiOperation({
      summary: "Filtrar libros con criterios avanzados - Acceso: ADMIN, USER",
      description: "Filtra libros del catálogo utilizando criterios avanzados como género, precio, disponibilidad, etc.",
    }),
    ApiBody({
      type: BookFiltersDto,
      description: "Criterios de filtrado para los libros",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Libros filtrados obtenidos exitosamente",
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