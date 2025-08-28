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
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

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
      example: 'b8c4e4b2-1234-5678-9abc-def123456789',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuario actualizado exitosamente',
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponseDto) },
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
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'El nombre de usuario debe tener al menos 3 caracteres',
              'Debe proporcionar un email válido',
            ],
          },
          error: { type: 'string', example: 'Solicitud incorrecta' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'No autorizado' },
          error: { type: 'string', example: 'Sin autorización' },
        },
      },
    }),
    ApiForbiddenResponse({
      description:
        'Acceso denegado - No tiene permisos para actualizar este usuario',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Acceso denegado' },
          error: { type: 'string', example: 'Prohibido' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Usuario no encontrado con el ID proporcionado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Usuario no encontrado' },
          error: { type: 'string', example: 'No encontrado' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'Conflicto - El nombre de usuario o email ya están en uso',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: { type: 'string', example: 'El email ya está registrado' },
          error: { type: 'string', example: 'Conflicto' },
        },
      },
    }),
  );
}