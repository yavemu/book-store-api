import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';
import { BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto } from '../../../common/dto';
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
          id: { type: 'string'},
          bookId: { type: 'string'},
          authorId: { type: 'string'},
          assignmentOrder: { type: 'number'},
          createdAt: { type: 'string'}
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
  );
}