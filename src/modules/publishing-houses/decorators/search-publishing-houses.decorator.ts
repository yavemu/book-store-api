import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PublishingHouseListResponseDto } from '../dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export function ApiSearchPublishingHouses() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Buscar editoriales - Acceso: ADMIN, USER',
      description: 'Busca editoriales por término en nombre, descripción o país.',
    }),
    ApiQuery({
      name: 'term',
      required: true,
      type: String,
      description: 'Término de búsqueda para filtrar editoriales',
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: 'Resultados de búsqueda de editoriales obtenidos exitosamente',
      type: PublishingHouseListResponseDto,
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
