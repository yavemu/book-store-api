import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiUnauthorizedResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { UserProfileResponseDto } from '../dto';
import { UnauthorizedResponseDto } from '../../../common/dto';

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
      type: UnauthorizedResponseDto,
    })
  );
}