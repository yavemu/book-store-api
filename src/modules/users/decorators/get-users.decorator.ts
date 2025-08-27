import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { UserListResponseDto } from '../dto';

export function ApiGetUsers() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Obtener lista de usuarios - Acceso: ADMIN',
      description: 'Obtiene una lista paginada de todos los usuarios del sistema. Solo accesible para administradores.' 
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número de página para la paginación',
      example: 1
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Número de elementos por página (máximo 100)',
      example: 10
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Campo por el cual ordenar los resultados',
      example: 'createdAt'
    }),
    ApiQuery({
      name: 'sortOrder',
      required: false,
      enum: ['ASC', 'DESC'],
      description: 'Orden de clasificación ascendente o descendente',
      example: 'DESC'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Lista de usuarios obtenida exitosamente',
      type: UserListResponseDto
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
    })
  );
}