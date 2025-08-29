import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponseDto, UnauthorizedResponseDto, ForbiddenResponseDto, NotFoundResponseDto } from '../../../common/dto';

export function ApiDeleteUser() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Eliminar usuario del sistema - Acceso: ADMIN',
      description:
        'Realiza una eliminación lógica (soft delete) de un usuario del sistema. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del usuario a eliminar (UUID)',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuario eliminado exitosamente del sistema',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                },
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
    ApiNotFoundResponse({
      description: 'Usuario no encontrado con el ID proporcionado',
      type: NotFoundResponseDto,
    }),
  );
}