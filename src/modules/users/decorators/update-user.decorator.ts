import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserResponseDto } from '../dto/user-response.dto';
import {
  ApiResponseDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
  ConflictResponseDto,
} from '../../../common/dto';

export function ApiUpdateUser() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Actualizar información de usuario - Acceso: ADMIN',
      description:
        'Actualiza la información de un usuario existente. Los usuarios pueden actualizar su propio perfil, los administradores pueden actualizar cualquier usuario.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del usuario a actualizar (UUID)',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuario actualizado exitosamente',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(UserResponseDto),
              },
            },
          },
        ],
      },
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos o errores de validación',
      type: BadRequestResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - No tiene permisos para actualizar este usuario',
      type: ForbiddenResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Usuario no encontrado con el ID proporcionado',
      type: NotFoundResponseDto,
    }),
    ApiConflictResponse({
      description: 'Conflicto - El nombre de usuario o email ya están en uso',
      type: ConflictResponseDto,
    }),
  );
}
