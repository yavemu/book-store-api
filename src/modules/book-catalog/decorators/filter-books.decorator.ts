import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiBody,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { BookCatalogListResponseDto, BookFiltersDto } from '../dto';

export function ApiFilterBooks() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Filtrar libros con criterios avanzados',
      description: 'Filtra libros del catálogo utilizando criterios avanzados como género, precio, disponibilidad, etc.' 
    }),
    ApiBody({
      type: BookFiltersDto,
      description: 'Criterios de filtrado para los libros'
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
      description: 'Libros filtrados obtenidos exitosamente',
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