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
import { UserResponseDto } from '../dto';

export function ApiGetUserById() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Obtener usuario por ID - Acceso: ADMIN',
      description: 'Obtiene la información detallada de un usuario específico por su ID único.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del usuario (UUID)',
      example: 'b8c4e4b2-1234-5678-9abc-def123456789'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Usuario encontrado exitosamente',
      type: UserResponseDto
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
      description: 'Acceso denegado - No tiene permisos para ver este usuario',
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