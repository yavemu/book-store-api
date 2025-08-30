import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';

export function ApiGetGenreById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener género por ID - Acceso: ADMIN, USER',
      description: 'Obtiene un género específico de libros utilizando su ID único.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID único del género de libro',
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
