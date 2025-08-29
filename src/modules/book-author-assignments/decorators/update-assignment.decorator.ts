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
import { BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto } from '../../../common/dto';
import { UpdateBookAuthorAssignmentDto } from '../dto';

export function ApiUpdateAssignment() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Actualizar asignación autor-libro - Acceso: ADMIN',
      description: 'Actualiza una asignación existente entre un libro y un autor. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      description: 'ID de la asignación libro-autor a actualizar'}),
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
          id: { type: 'string'},
          bookId: { type: 'string'},
          authorId: { type: 'string'},
          assignmentOrder: { type: 'number'},
          updatedAt: { type: 'string'}
        }
      }
    }),
    ApiBadRequestResponse({
      description: 'Solicitud incorrecta - Datos de entrada inválidos',
      type: BadRequestResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Asignación no encontrada',
      type: NotFoundResponseDto,
    }),
  );
}