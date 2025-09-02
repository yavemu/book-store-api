import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiNotFoundResponse,
  ApiParam,
  getSchemaPath,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookCatalogResponseDto } from '../dto';
import {
  ApiResponseDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';

export function ApiGetBookById() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener libro por ID - Acceso: ADMIN, USER',
      description:
        'Obtiene los detalles completos de un libro específico del catálogo usando su ID único. Endpoint público.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del libro en el catálogo',
    }),
    ApiResponse({
      status: 200,
      description: 'Libro encontrado y devuelto exitosamente',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(BookCatalogResponseDto),
              },
            },
          },
        ],
      },
    }),
    ApiNotFoundResponse({
      description: 'Libro no encontrado en el catálogo',
      type: NotFoundResponseDto,
    }),
  );
}
