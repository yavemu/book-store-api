import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto } from '../../../common/dto';

export function ApiGetAssignmentById() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener asignación por ID - Acceso: ADMIN, USER',
      description: 'Obtiene una asignación específica entre libro y autor por su ID.' 
    }),
    ApiParam({
      name: 'id',
      description: 'ID de la asignación libro-autor'}),
    ApiResponse({ 
      status: 200, 
      description: 'Asignación libro-autor obtenida exitosamente',
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
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Asignación no encontrada',
      type: NotFoundResponseDto,
    }),
  );
}