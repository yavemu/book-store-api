import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse, 
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { CreateBookCatalogResponseDto } from '../dto';

export function ApiCreateBook() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Crear nuevo libro en el catálogo - Acceso: ADMIN',
      description: 'Crea un nuevo libro en el catálogo del sistema. Solo accesible para administradores.' 
    }),
    ApiResponse({ 
      status: 201, 
      description: 'Libro creado exitosamente en el catálogo',
      type: CreateBookCatalogResponseDto
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
              'El título del libro es requerido',
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
    ApiConflictResponse({
      description: 'El código ISBN ya existe en el catálogo',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: { type: 'string', example: 'El código ISBN ya está registrado en el catálogo' },
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