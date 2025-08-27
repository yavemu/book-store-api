import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

export function ApiDeleteAssignment() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Eliminar asignación autor-libro',
      description: 'Elimina (soft delete) una asignación entre un libro y un autor. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      description: 'ID de la asignación libro-autor a eliminar',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Asignación libro-autor eliminada exitosamente',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Asignación eliminada exitosamente' }
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
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Acceso denegado' }
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