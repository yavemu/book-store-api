import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';
import { UpdateBookGenreDto } from '../dto';

export function ApiUpdateGenre() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Actualizar género de libro - Acceso: ADMIN',
      description: 'Actualiza un género de libro existente. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID único del género de libro a actualizar',
    }),
    ApiBody({
      type: UpdateBookGenreDto,
      description: 'Datos para actualizar el género de libro',
    }),
    ApiResponse({
      status: 200,
      description: 'Género de libro obtenido exitosamente',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: {
            type: 'string',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
              },
              name: { type: 'string' },
              description: {
                type: 'string',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Solicitud incorrecta - Datos de entrada inválidos',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: {
            type: 'array',
            items: { type: 'string' },
          },
          error: { type: 'string' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Género no encontrado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' },
        },
      },
    }),
  );
}
