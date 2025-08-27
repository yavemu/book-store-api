import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';

export function ApiCheckIsbn() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Verificar existencia de ISBN',
      description: 'Verifica si un ISBN específico ya existe en el catálogo de libros. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'isbn',
      description: 'Código ISBN a verificar',
      example: '978-0-134-68552-4'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Verificación de ISBN realizada exitosamente',
      schema: {
        type: 'object',
        properties: {
          exists: { 
            type: 'boolean', 
            example: false,
            description: 'Indica si el ISBN ya existe en el catálogo'
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
    })
  );
}