import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { PublishingHouseListResponseDto } from '../dto';

export function ApiSearchPublishingHouses() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Buscar editoriales - Acceso: ADMIN, USER',
      description: 'Busca editoriales por término en nombre, descripción o país.' 
    }),
    ApiQuery({
      name: 'term',
      required: true,
      type: String,
      description: 'Término de búsqueda para filtrar editoriales',
      example: 'Penguin'
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número de página para la paginación',
      example: 1
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Número de elementos por página (máximo 100)',
      example: 10
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Resultados de búsqueda de editoriales obtenidos exitosamente',
      type: PublishingHouseListResponseDto
    }),
    ApiUnauthorizedResponse({ 
      description: 'No autorizado - Token JWT inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'No autorizado' }
        }
      }
    })
  );
}