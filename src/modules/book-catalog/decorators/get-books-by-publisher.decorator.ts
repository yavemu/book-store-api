import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiParam,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { BookCatalogListResponseDto } from '../dto';

export function ApiGetBooksByPublisher() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener libros por editorial - Acceso: ADMIN, USER',
      description: 'Obtiene una lista paginada de libros filtrados por una editorial específica.' 
    }),
    ApiParam({
      name: 'publisherId',
      description: 'ID de la editorial para filtrar los libros',
      example: '550e8400-e29b-41d4-a716-446655440002'
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
      description: 'Libros de la editorial especificada obtenidos exitosamente',
      type: BookCatalogListResponseDto
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