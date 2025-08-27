import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { UpdateBookGenreDto } from '../dto';

export function ApiUpdateGenre() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Actualizar género de libro',
      description: 'Actualiza un género de libro existente. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      description: 'ID único del género de libro a actualizar',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiBody({
      type: UpdateBookGenreDto,
      description: 'Datos para actualizar el género de libro'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Género de libro actualizado exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
          genreName: { type: 'string', example: 'Ciencia Ficción Moderna' },
          genreDescription: { type: 'string', example: 'Ficción contemporánea que explora tecnología avanzada y conceptos científicos futuristas.' },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-02T00:00:00.000Z' }
        }
      }
    }),
    ApiBadRequestResponse({
      description: 'Solicitud incorrecta - Datos de entrada inválidos',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'array', items: { type: 'string' }, example: ['genreName should not be empty', 'genreName must be longer than or equal to 2 characters'] },
          error: { type: 'string', example: 'Bad Request' }
        }
      }
    }),
    ApiUnauthorizedResponse({ 
      description: 'No autorizado - Token JWT inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'No autorizado' }
        }
      }
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Acceso denegado' }
        }
      }
    }),
    ApiNotFoundResponse({
      description: 'Género no encontrado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Género no encontrado' }
        }
      }
    })
  );
}