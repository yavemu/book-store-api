import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse,
  ApiNotFoundResponse,
  ApiParam
} from '@nestjs/swagger';
import { PublishingHouseResponseDto } from '../dto';

export function ApiGetPublishingHouseById() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener editorial por ID',
      description: 'Obtiene los detalles completos de una editorial específica usando su ID único. Endpoint público.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único de la editorial',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Editorial encontrada y devuelta exitosamente',
      type: PublishingHouseResponseDto
    }),
    ApiNotFoundResponse({
      description: 'Editorial no encontrada',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Editorial no encontrada' },
          error: { type: 'string', example: 'No encontrado' }
        }
      }
    })
  );
}