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
import { BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto } from '../../../common/dto';
import { DeleteBookAuthorResponseDto } from '../dto';

export function ApiDeleteAuthor() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Eliminar autor del sistema - Acceso: ADMIN',
      description: 'Elimina un autor del sistema (eliminación lógica). Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del autor a eliminar'}),
    ApiResponse({ 
      status: 200, 
      description: 'Autor eliminado exitosamente',
      type: DeleteBookAuthorResponseDto
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Autor no encontrado',
      type: NotFoundResponseDto,
    }),
  );
}