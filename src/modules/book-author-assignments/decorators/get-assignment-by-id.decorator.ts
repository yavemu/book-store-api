import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

export function ApiGetAssignmentById() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener asignación por ID',
      description: 'Obtiene una asignación específica entre libro y autor por su ID.' 
    }),
    ApiParam({
      name: 'id',
      description: 'ID de la asignación libro-autor',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Asignación libro-autor obtenida exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
          bookId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
          authorId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
          assignmentOrder: { type: 'number', example: 1 },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
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
      description: 'Asignación no encontrada',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Asignación no encontrada' }
        }
      }
    })
  );
}