import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { DeleteBookAuthorResponseDto } from '../dto';

export function ApiDeleteAuthor() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Eliminar autor del sistema',
      description: 'Elimina un autor del sistema (eliminación lógica). Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del autor a eliminar',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Autor eliminado exitosamente',
      type: DeleteBookAuthorResponseDto
    }),
    ApiUnauthorizedResponse({ 
      description: 'No autorizado - Token JWT inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'No autorizado' },
          error: { type: 'string', example: 'Sin autorización' }
        }
      }
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Acceso denegado' },
          error: { type: 'string', example: 'Prohibido' }
        }
      }
    }),
    ApiNotFoundResponse({
      description: 'Autor no encontrado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Autor no encontrado' },
          error: { type: 'string', example: 'No encontrado' }
        }
      }
    })
  );
}