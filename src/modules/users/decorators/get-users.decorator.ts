import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserListResponseDto } from '../dto';
import { PaginationDto, ApiResponseDto, UnauthorizedResponseDto, ForbiddenResponseDto } from '../../../common/dto';

export function ApiGetUsers() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener lista de usuarios - Acceso: ADMIN',
      description:
        'Obtiene una lista paginada de todos los usuarios del sistema. Solo accesible para administradores.',
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, UserListResponseDto),
    ApiResponse({
      status: 200,
      description: 'Lista de usuarios obtenida exitosamente',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(UserListResponseDto),
              },
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
  );
}