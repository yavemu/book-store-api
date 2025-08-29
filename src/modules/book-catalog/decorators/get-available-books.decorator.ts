import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse, ApiExtraModels, getSchemaPath } from "@nestjs/swagger";
import { BookCatalogResponseDto } from '../dto';
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

export function ApiGetAvailableBooks() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener libros disponibles - Acceso: ADMIN, USER",
      description: "Obtiene una lista paginada de libros disponibles para compra en el catálogo.",
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, BookCatalogResponseDto),
    ApiResponse({
      status: 200,
      description: "Libros disponibles obtenidos exitosamente",
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