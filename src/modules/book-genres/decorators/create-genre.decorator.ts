import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse, 
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiBearerAuth
} from '@nestjs/swagger';

export function ApiCreateBookGenre() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Crear nuevo género de libro - Acceso: ADMIN',
      description: 'Crea un nuevo género de libro en el catálogo. Solo accesible para administradores.' 
    }),
    ApiResponse({
      status: 201,
      description: 'Género de libro creado exitosamente',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: {
            type: 'string',
            example: 'Género de libro creado exitosamente',
          },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'genre-uuid-123' },
              name: { type: 'string', example: 'Ciencia Ficción' },
              description: {
                type: 'string',
                example: 'Libros del género de ciencia ficción',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-01T00:00:00.000Z',
              },
            },
          },
        },
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
            example: ['El nombre del género es requerido', 'El nombre debe tener al menos 2 caracteres']
          },
          error: { type: 'string', example: 'Solicitud incorrecta' }
        }
      }
    }),
    ApiConflictResponse({
      description: 'El género ya existe en el sistema',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: { type: 'string', example: 'El género ya existe' },
          error: { type: 'string', example: 'Conflicto' }
        }
      }
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Acceso denegado' },
          error: { type: 'string', example: 'Prohibido' }
        }
      }
    })
  );
}