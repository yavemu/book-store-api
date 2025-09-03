import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookAuthorAssignmentListResponseDto } from '../dto';
import {
  PaginationInputDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
} from '../../../common/dto';

export function ApiGetAssignments() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener asignaciones autor-libro - Acceso: ADMIN, USER',
      description: 'Obtiene una lista paginada de todas las asignaciones entre libros y autores.',
    }),
    ApiQuery({ type: PaginationInputDto }),
    ApiResponse({
      status: 200,
      description: 'Asignaciones libro-autor obtenidas exitosamente',
      type: BookAuthorAssignmentListResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos válidos',
      type: ForbiddenResponseDto,
    }),
  );
}
