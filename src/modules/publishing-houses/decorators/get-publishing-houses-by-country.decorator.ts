import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { PublishingHouseListResponseDto } from '../dto';

export function ApiGetPublishingHousesByCountry() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener editoriales por país - Acceso: ADMIN, USER',
      description: 'Obtiene una lista paginada de editoriales filtradas por un país específico.' 
    }),
    ApiParam({
      name: 'country',
      description: 'Nombre del país para filtrar las editoriales',
      example: 'United States'
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
      description: 'Editoriales del país especificado obtenidas exitosamente',
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