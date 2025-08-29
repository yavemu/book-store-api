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
import { UserResponseDto } from '../dto/user-response.dto';
import { ApiResponseDto, UnauthorizedResponseDto, ForbiddenResponseDto, NotFoundResponseDto } from '../../../common/dto';

export function ApiGetUserById() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener usuario por ID - Acceso: ADMIN',
      description:
        'Obtiene la información detallada de un usuario específico por su ID único.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del usuario (UUID)',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuario encontrado exitosamente',
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
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - No tiene permisos para ver este usuario',
      type: ForbiddenResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Usuario no encontrado con el ID proporcionado',
      type: NotFoundResponseDto,
    }),
  );
}