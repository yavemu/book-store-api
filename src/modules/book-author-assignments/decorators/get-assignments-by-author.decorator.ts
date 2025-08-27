import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

export function ApiGetAssignmentsByAuthor() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener asignaciones por autor',
      description: 'Obtiene todas las asignaciones de libros para un autor específico.' 
    }),
    ApiParam({
      name: 'authorId',
      description: 'ID del autor para filtrar asignaciones',
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
      description: 'Asignaciones del autor especificado obtenidas exitosamente',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
                bookId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
                authorId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
                assignmentOrder: { type: 'number', example: 1 },
                createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
              }
            }
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 15 },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 2 }
            }
          }
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
    })
  );
}