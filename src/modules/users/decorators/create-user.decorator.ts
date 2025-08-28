import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserResponseDto } from '../dto/user-response.dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

export function ApiCreateUser() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Crear nuevo usuario - Acceso: ADMIN',
      description:
        'Crea un nuevo usuario en el sistema. Solo accesible para administradores.',
    }),
    ApiResponse({
      status: 201,
      description: 'Usuario creado exitosamente',
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
              'La contraseña debe tener al menos 6 caracteres',
            ],
          },
          error: { type: 'string', example: 'Solicitud incorrecta' },
        },
      },
    }),
    ApiConflictResponse({
      description: 'El usuario ya existe en el sistema',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: {
            type: 'string',
            example: 'El nombre de usuario ya está en uso',
          },
          error: { type: 'string', example: 'Conflicto' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Acceso denegado' },
          error: { type: 'string', example: 'Prohibido' },
        },
      },
    }),
  );
}