import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiUnauthorizedResponse, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { BookCatalogResponseDto, BookFiltersDto } from '../dto';
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

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
    ApiExtraModels(PaginationDto, ApiResponseDto, BookCatalogResponseDto),
    ApiResponse({
      status: 200,
      description: "Libros filtrados obtenidos exitosamente",
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