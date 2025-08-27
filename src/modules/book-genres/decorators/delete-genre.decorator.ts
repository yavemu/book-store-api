import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

export function ApiDeleteGenre() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Eliminar género de libro',
      description: 'Elimina (soft delete) un género de libro del sistema. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      description: 'ID único del género de libro a eliminar',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Género de libro eliminado exitosamente',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Género eliminado exitosamente' }
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
      description: 'Género no encontrado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Género no encontrado' }
        }
      }
    })
  );
}