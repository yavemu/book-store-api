import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { CreateBookAuthorAssignmentDto } from '../dto';

export function ApiCreateAssignment() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Crear asignación autor-libro - Acceso: ADMIN',
      description: 'Crea una nueva asignación entre un libro y un autor. Solo accesible para administradores.' 
    }),
    ApiBody({
      type: CreateBookAuthorAssignmentDto,
      description: 'Datos para crear la asignación libro-autor'
    }),
    ApiResponse({ 
      status: 201, 
      description: 'Asignación libro-autor creada exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
          bookId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
          authorId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
          assignmentOrder: { type: 'number', example: 1 },
          createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
        }
      }
    }),
    ApiBadRequestResponse({
      description: 'Solicitud incorrecta - Datos de entrada inválidos',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { type: 'array', items: { type: 'string' }, example: ['bookId should not be empty', 'authorId should not be empty'] },
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
    })
  );
}