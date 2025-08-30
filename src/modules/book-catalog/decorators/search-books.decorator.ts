import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiExtraModels,
  getSchemaPath,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookCatalogResponseDto } from '../dto';
import {
  PaginationDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';
import { ApiResponseDto } from '../../../common/dto';

export function ApiSearchBooks() {
  return applyDecorators(
    ApiOperation({
      summary: 'Buscar libros en el catálogo - Acceso: ADMIN, USER',
      description:
        'Busca libros en el catálogo por un término de búsqueda en el título, código ISBN o resumen. Endpoint público.',
    }),
    ApiQuery({
      name: 'term',
      required: true,
      type: String,
      description: 'Término de búsqueda',
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, BookCatalogResponseDto),
    ApiResponse({
      status: 200,
      description: 'Resultados de la búsqueda de libros',
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
                    },
                  },
                },
              },
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' },
        },
      },
    }),
  );
}
