import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { BookCatalogListResponseDto } from '../dto';

export function ApiSearchBooks() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Buscar libros - Acceso: ADMIN, USER',
      description: 'Busca libros en el catálogo por término de búsqueda en título, descripción o autor.' 
    }),
    ApiQuery({
      name: 'term',
      required: true,
      type: String,
      description: 'Término de búsqueda para filtrar libros',
      example: 'Harry Potter'
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
      description: 'Resultados de búsqueda obtenidos exitosamente',
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