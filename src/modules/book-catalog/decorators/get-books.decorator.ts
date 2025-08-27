import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiQuery
} from '@nestjs/swagger';
import { BookCatalogListResponseDto } from '../dto';

export function ApiGetBooks() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener catálogo de libros',
      description: 'Obtiene una lista paginada de todos los libros en el catálogo con filtros opcionales. Endpoint público.' 
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
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Campo por el cual ordenar los resultados',
      example: 'createdAt'
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['ASC', 'DESC'],
      description: 'Orden de clasificación ascendente o descendente',
      example: 'DESC'
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Término de búsqueda para filtrar por título del libro',
      example: 'The Shining'
    }),
    ApiQuery({
      name: 'genreId',
      required: false,
      type: String,
      description: 'ID del género para filtrar libros por categoría',
      example: '550e8400-e29b-41d4-a716-446655440001'
    }),
    ApiQuery({
      name: 'publisherId',
      required: false,
      type: String,
      description: 'ID de la editorial para filtrar libros por publicador',
      example: '550e8400-e29b-41d4-a716-446655440002'
    }),
    ApiQuery({
      name: 'isAvailable',
      required: false,
      type: Boolean,
      description: 'Filtrar por disponibilidad del libro',
      example: true
    }),
    ApiQuery({
      name: 'minPrice',
      required: false,
      type: Number,
      description: 'Precio mínimo para filtrar libros',
      example: 10.00
    }),
    ApiQuery({
      name: 'maxPrice',
      required: false,
      type: Number,
      description: 'Precio máximo para filtrar libros',
      example: 50.00
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Catálogo de libros obtenido exitosamente',
      type: BookCatalogListResponseDto
    })
  );
}