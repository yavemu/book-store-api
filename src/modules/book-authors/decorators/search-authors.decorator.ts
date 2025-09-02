import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookAuthorListResponseDto } from '../dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export function ApiSearchAuthors() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Buscar autores - Acceso: ADMIN, USER',
      description: 'Busca autores por término en nombre, apellido o biografía.',
    }),
    ApiQuery({
      name: 'term',
      required: true,
      type: String,
      description: 'Término de búsqueda para filtrar autores',
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: 'Resultados de búsqueda de autores obtenidos exitosamente',
      type: BookAuthorListResponseDto,
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
