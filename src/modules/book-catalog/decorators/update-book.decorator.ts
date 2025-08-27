import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse, 
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { UpdateBookCatalogResponseDto } from '../dto';

export function ApiUpdateBook() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Actualizar libro del catálogo',
      description: 'Actualiza la información de un libro existente en el catálogo. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del libro a actualizar',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Libro actualizado exitosamente',
      type: UpdateBookCatalogResponseDto
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
              'El título del libro debe tener al menos 1 carácter',
              'El código ISBN debe tener entre 10 y 13 caracteres',
              'El precio debe ser un número positivo'
            ]
          },
          error: { type: 'string', example: 'Solicitud incorrecta' }
        }
      }
    }),
    ApiUnauthorizedResponse({ 
      description: 'No autorizado - Token JWT inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'No autorizado' },
          error: { type: 'string', example: 'Sin autorización' }
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
    }),
    ApiNotFoundResponse({
      description: 'Libro no encontrado en el catálogo',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Libro no encontrado en el catálogo' },
          error: { type: 'string', example: 'No encontrado' }
        }
      }
    }),
    ApiConflictResponse({
      description: 'El código ISBN ya está en uso por otro libro',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: { type: 'string', example: 'El código ISBN ya está registrado en el catálogo' },
          error: { type: 'string', example: 'Conflicto' }
        }
      }
    })
  );
}