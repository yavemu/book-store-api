import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { BookAuthorListResponseDto } from '../dto';

export function ApiSearchAuthors() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Buscar autores - Acceso: ADMIN, USER',
      description: 'Busca autores por término en nombre, apellido o biografía.' 
    }),
    ApiQuery({
      name: 'term',
      required: true,
      type: String,
      description: 'Término de búsqueda para filtrar autores',
      example: 'Stephen King'
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
      description: 'Resultados de búsqueda de autores obtenidos exitosamente',
      type: BookAuthorListResponseDto
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