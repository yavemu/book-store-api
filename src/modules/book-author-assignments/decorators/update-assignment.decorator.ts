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
import { UpdateBookAuthorAssignmentDto } from '../dto';

export function ApiUpdateAssignment() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Actualizar asignación autor-libro',
      description: 'Actualiza una asignación existente entre un libro y un autor. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      description: 'ID de la asignación libro-autor a actualizar',
      example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    ApiBody({
      type: UpdateBookAuthorAssignmentDto,
      description: 'Datos para actualizar la asignación libro-autor'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Asignación libro-autor actualizada exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
          bookId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440001' },
          authorId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440002' },
          assignmentOrder: { type: 'number', example: 2 },
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
          message: { type: 'array', items: { type: 'string' }, example: ['assignmentOrder must be a positive number'] },
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
      description: 'Asignación no encontrada',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Asignación no encontrada' }
        }
      }
    })
  );
}