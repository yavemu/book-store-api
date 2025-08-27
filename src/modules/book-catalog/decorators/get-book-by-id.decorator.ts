import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse,
  ApiNotFoundResponse,
  ApiParam
} from '@nestjs/swagger';
import { BookCatalogResponseDto } from '../dto';

export function ApiGetBookById() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener libro por ID - Acceso: ADMIN, USER',
      description: 'Obtiene los detalles completos de un libro específico del catálogo usando su ID único. Endpoint público.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del libro en el catálogo',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Libro encontrado y devuelto exitosamente',
      type: BookCatalogResponseDto
    }),
    ApiNotFoundResponse({
      description: 'Libro no encontrado en el catálogo',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Libro no encontrado en el catálogo' },
          error: { type: 'string', example: 'No encontrado' }
        }
      }
    })
  );
}