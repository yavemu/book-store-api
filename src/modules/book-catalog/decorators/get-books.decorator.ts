import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiExtraModels } from "@nestjs/swagger";
import { BookCatalogListResponseDto } from '../dto';
import { PaginationDto } from "../../../common/dto/pagination.dto";

export function ApiGetBooks() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener catálogo de libros - Acceso: ADMIN, USER",
      description: "Obtiene una lista paginada de todos los libros en el catálogo con filtros opcionales. Endpoint público.",
    }),
    ApiQuery({
      name: "search",
      required: false,
      type: String,
      description: "Término de búsqueda para filtrar por título del libro",
      example: "The Shining",
    }),
    ApiQuery({
      name: "genreId",
      required: false,
      type: String,
      description: "ID del género para filtrar libros por categoría",
      example: "550e8400-e29b-41d4-a716-446655440001",
    }),
    ApiQuery({
      name: "publisherId",
      required: false,
      type: String,
      description: "ID de la editorial para filtrar libros por publicador",
      example: "550e8400-e29b-41d4-a716-446655440002",
    }),
    ApiQuery({
      name: "isAvailable",
      required: false,
      type: Boolean,
      description: "Filtrar por disponibilidad del libro",
      example: true,
    }),
    ApiQuery({
      name: "minPrice",
      required: false,
      type: Number,
      description: "Precio mínimo para filtrar libros",
      example: 10.0,
    }),
    ApiQuery({
      name: "maxPrice",
      required: false,
      type: Number,
      description: "Precio máximo para filtrar libros",
      example: 50.0,
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Catálogo de libros obtenido exitosamente",
      type: BookCatalogListResponseDto,
    }),
  );
}