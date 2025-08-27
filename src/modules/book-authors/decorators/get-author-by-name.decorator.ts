import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { BookAuthorResponseDto } from '../dto';

export function ApiGetAuthorByName() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener autor por nombre completo - Acceso: ADMIN, USER',
      description: 'Obtiene un autor específico utilizando su nombre y apellido.' 
    }),
    ApiParam({
      name: 'firstName',
      description: 'Nombre del autor',
      example: 'Stephen'
    }),
    ApiParam({
      name: 'lastName',
      description: 'Apellido del autor',
      example: 'King'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Autor obtenido exitosamente',
      type: BookAuthorResponseDto
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
    ApiNotFoundResponse({
      description: 'Autor no encontrado',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Autor no encontrado' }
        }
      }
    })
  );
}