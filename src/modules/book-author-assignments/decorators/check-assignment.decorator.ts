import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

export function ApiCheckAssignment() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Verificar existencia de asignación',
      description: 'Verifica si existe una asignación entre un libro y un autor específicos.' 
    }),
    ApiParam({
      name: 'bookId',
      description: 'ID del libro a verificar',
      example: '550e8400-e29b-41d4-a716-446655440001'
    }),
    ApiParam({
      name: 'authorId',
      description: 'ID del autor a verificar',
      example: '550e8400-e29b-41d4-a716-446655440002'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Verificación de asignación realizada exitosamente',
      schema: {
        type: 'object',
        properties: {
          exists: { 
            type: 'boolean', 
            example: false,
            description: 'Indica si existe la asignación entre el libro y el autor'
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