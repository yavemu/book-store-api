import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { BookCatalogResponseDto } from '../dto';
import { PaginationDto , BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto} from '../../../common/dto';
import { ApiResponseDto } from '../../../common/dto';

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
    }),
    ApiQuery({
      name: "genreId",
      required: false,
      type: String,
      description: "ID del género para filtrar libros por categoría",
    }),
    ApiQuery({
      name: "publisherId",
      required: false,
      type: String,
      description: "ID de la editorial para filtrar libros por publicador",
    }),
    ApiQuery({
      name: "isAvailable",
      required: false,
      type: Boolean,
      description: "Filtrar por disponibilidad del libro",
    }),
    ApiQuery({
      name: "minPrice",
      required: false,
      type: Number,
      description: "Precio mínimo para filtrar libros",
    }),
    ApiQuery({
      name: "maxPrice",
      required: false,
      type: Number,
      description: "Precio máximo para filtrar libros",
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, BookCatalogResponseDto),
    ApiResponse({
      status: 200,
      description: "Catálogo de libros obtenido exitosamente",
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                properties: {
                  data: {
                    type: 'array',
                    items: { $ref: getSchemaPath(BookCatalogResponseDto) },
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
                    }
                  }
                }
              },
            },
          },
        ],
      },
    }),
  );
}