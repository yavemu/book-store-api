import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UserListResponseDto } from '../dto';
import {
  PaginationInputDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
  BadRequestResponseDto,
} from '../../../common/dto';

export function ApiFilterUsersRealtime() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Filtrar usuarios en tiempo real - Acceso: ADMIN, USER',
      description:
        'Búsqueda optimizada para filtrado en tiempo real con debounce. Mínimo 3 caracteres. ACCESO: Solo administradores.',
    }),
    ApiQuery({
      name: 'term',
      description: 'Término de búsqueda para filtrar usuarios (mínimo 3 caracteres)',
      required: true,
      type: String,
    }),
    ApiQuery({ type: PaginationInputDto }),
    ApiResponse({
      status: 200,
      description: 'Lista paginada de usuarios filtrados',
      type: UserListResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Error de validación - término de búsqueda muy corto',
      type: BadRequestResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos válidos',
      type: ForbiddenResponseDto,
    }),
  );
}
