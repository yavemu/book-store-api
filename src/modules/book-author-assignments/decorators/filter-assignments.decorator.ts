import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AssignmentFiltersDto } from '../dto';

export function ApiFilterAssignments() {
  return applyDecorators(
    ApiOperation({
      summary: 'Filtrar asignaciones libro-autor con criterios avanzados - Acceso: ADMIN, USER',
      description:
        'Filtra asignaciones entre libros y autores utilizando criterios específicos como ID de libro, ID de autor, fechas de creación.',
    }),
    ApiBody({
      type: AssignmentFiltersDto,
      description: 'Criterios de filtrado para las asignaciones libro-autor',
    }),
    ApiResponse({
      status: 200,
      description: 'Asignaciones libro-autor filtradas obtenidas exitosamente',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    bookId: { type: 'string', format: 'uuid' },
                    authorId: { type: 'string', format: 'uuid' },
                    book: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        title: { type: 'string' },
                        isbn: { type: 'string' },
                        publicationDate: { type: 'string', format: 'date' },
                      },
                    },
                    author: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        nationality: { type: 'string' },
                        birthDate: { type: 'string', format: 'date' },
                      },
                    },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
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
                  hasNext: { type: 'boolean' },
                  hasPrev: { type: 'boolean' },
                },
              },
            },
          },
          message: { type: 'string' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
    }),
    ApiBearerAuth(),
  );
}
