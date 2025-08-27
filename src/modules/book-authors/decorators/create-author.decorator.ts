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
import { CreateBookAuthorResponseDto } from '../dto';

export function ApiCreateAuthor() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Crear nuevo autor - Acceso: ADMIN',
      description: 'Crea un nuevo autor en el sistema. Solo accesible para administradores.' 
    }),
    ApiResponse({ 
      status: 201, 
      description: 'Autor creado exitosamente',
      type: CreateBookAuthorResponseDto
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
              'El nombre del autor es requerido',
              'El apellido del autor es requerido',
              'El nombre debe tener entre 1 y 50 caracteres'
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
      description: 'El autor ya existe en el sistema',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: { type: 'string', example: 'Ya existe un autor con ese nombre y apellido' },
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