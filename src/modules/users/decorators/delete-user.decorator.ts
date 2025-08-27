import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { DeleteUserResponseDto } from '../dto';

export function ApiDeleteUser() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Eliminar usuario del sistema - Acceso: ADMIN',
      description: 'Realiza una eliminación lógica (soft delete) de un usuario del sistema. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del usuario a eliminar (UUID)',
      example: 'b8c4e4b2-1234-5678-9abc-def123456789'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Usuario eliminado exitosamente del sistema',
      type: DeleteUserResponseDto
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
      description: 'Usuario no encontrado con el ID proporcionado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Usuario no encontrado' },
          error: { type: 'string', example: 'No encontrado' }
        }
      }
    })
  );
}