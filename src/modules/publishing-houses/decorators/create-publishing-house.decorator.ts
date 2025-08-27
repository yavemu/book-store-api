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
import { CreatePublishingHouseResponseDto } from '../dto';

export function ApiCreatePublishingHouse() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Crear nueva editorial - Acceso: ADMIN',
      description: 'Crea una nueva editorial en el sistema. Solo accesible para administradores.' 
    }),
    ApiResponse({ 
      status: 201, 
      description: 'Editorial creada exitosamente',
      type: CreatePublishingHouseResponseDto
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
              'El nombre de la editorial es requerido',
              'El nombre debe tener entre 2 y 100 caracteres',
              'El país debe tener entre 2 y 50 caracteres'
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
      description: 'La editorial ya existe en el sistema',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 409 },
          message: { type: 'string', example: 'Ya existe una editorial con ese nombre' },
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