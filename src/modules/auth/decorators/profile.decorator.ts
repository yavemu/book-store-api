import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiUnauthorizedResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { UserProfileResponseDto } from '../dto';

export function ApiGetProfile() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Obtener perfil del usuario actual - Acceso: ADMIN, USER',
      description: 'Obtiene la información del perfil del usuario autenticado' 
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Perfil de usuario obtenido exitosamente',
      type: UserProfileResponseDto
    }),
    ApiUnauthorizedResponse({ 
      description: 'No autorizado - Token inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'No autorizado' },
          timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
        }
      }
    })
  );
}