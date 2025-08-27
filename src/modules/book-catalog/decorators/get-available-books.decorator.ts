import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { BookCatalogListResponseDto } from '../dto';

export function ApiGetAvailableBooks() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener libros disponibles',
      description: 'Obtiene una lista paginada de libros disponibles para compra en el catálogo.' 
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
      description: 'Libros disponibles obtenidos exitosamente',
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