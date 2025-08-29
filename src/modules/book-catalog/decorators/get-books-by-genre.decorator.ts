import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiUnauthorizedResponse, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { BookCatalogResponseDto } from '../dto';
import { PaginationDto , BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto} from '../../../common/dto';
import { ApiResponseDto } from '../../../common/dto';

export function ApiGetBooksByGenre() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener libros por género - Acceso: ADMIN, USER",
      description: "Obtiene una lista paginada de libros que pertenecen a un género específico.",
    }),
    ApiParam({
      name: "genreId",
      required: true,
      type: String,
      description: "ID del género para filtrar los libros",
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, BookCatalogResponseDto),
    ApiResponse({
      status: 200,
      description: "Libros del género especificado obtenidos exitosamente",
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