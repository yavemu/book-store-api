import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AssignmentFiltersDto, BookAuthorAssignmentListResponseDto } from '../dto';
import {
  PaginationInputDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
} from '../../../common/dto';

export function ApiFilterAssignments() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Filtrar asignaciones libro-autor con criterios avanzados - Acceso: ADMIN, USER',
      description:
        'Filtra asignaciones entre libros y autores utilizando criterios específicos como ID de libro, ID de autor, fechas de creación.',
    }),
    ApiBody({
      type: AssignmentFiltersDto,
      description: 'Criterios de filtrado para las asignaciones libro-autor',
    }),
    ApiQuery({ type: PaginationInputDto }),
    ApiResponse({
      status: 200,
      description: 'Asignaciones libro-autor filtradas obtenidas exitosamente',
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
