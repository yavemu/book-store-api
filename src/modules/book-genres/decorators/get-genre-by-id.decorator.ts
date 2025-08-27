import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

export function ApiGetGenreById() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener género por ID',
      description: 'Obtiene un género específico de libros utilizando su ID único.' 
    }),
    ApiParam({
      name: 'id',
      description: 'ID único del género de libro',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Género de libro obtenido exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
          genreName: { type: 'string', example: 'Ciencia Ficción' },
          genreDescription: { type: 'string', example: 'Ficción que trata conceptos futuristas, ciencia y tecnología avanzada.' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-02T00:00:00.000Z' }
        }
      }
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
    }),
    ApiNotFoundResponse({
      description: 'Género no encontrado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Género no encontrado' }
        }
      }
    })
  );
}