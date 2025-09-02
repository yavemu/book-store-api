import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export function ApiGetAssignments() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener asignaciones autor-libro - Acceso: ADMIN, USER',
      description: 'Obtiene una lista paginada de todas las asignaciones entre libros y autores.',
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: 'Asignaciones libro-autor obtenidas exitosamente',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                bookId: { type: 'string' },
                authorId: { type: 'string' },
                assignmentOrder: { type: 'number' },
                createdAt: { type: 'string' },
              },
            },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
              totalPages: { type: 'number' },
            },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' },
        },
      },
    }),
  );
}
