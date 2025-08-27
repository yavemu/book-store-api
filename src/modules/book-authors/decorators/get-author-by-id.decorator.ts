import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse,
  ApiNotFoundResponse,
  ApiParam
} from '@nestjs/swagger';
import { BookAuthorResponseDto } from '../dto';

export function ApiGetAuthorById() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener autor por ID',
      description: 'Obtiene los detalles completos de un autor específico usando su ID único. Endpoint público.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del autor',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Autor encontrado y devuelto exitosamente',
      type: BookAuthorResponseDto
    }),
    ApiNotFoundResponse({
      description: 'Autor no encontrado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Autor no encontrado' },
          error: { type: 'string', example: 'No encontrado' }
        }
      }
    })
  );
}