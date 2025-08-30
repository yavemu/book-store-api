import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookAuthorFiltersDto } from '../dto';

export function ApiFilterAuthors() {
  return applyDecorators(
    ApiOperation({
      summary: 'Filtrar autores con criterios avanzados - Acceso: ADMIN, USER',
      description:
        'Filtra autores utilizando criterios específicos como nombre, nacionalidad, fecha de nacimiento, etc.',
    }),
    ApiBody({
      type: BookAuthorFiltersDto,
      description: 'Criterios de filtrado para los autores',
    }),
    ApiResponse({
      status: 200,
      description: 'Autores filtrados obtenidos exitosamente',
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
                    name: { type: 'string' },
                    biography: { type: 'string' },
                    birthDate: { type: 'string', format: 'date' },
                    nationality: { type: 'string' },
                    isActive: { type: 'boolean' },
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
