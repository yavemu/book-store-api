import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PublishingHouseFiltersDto } from '../dto';

export function ApiFilterPublishingHouses() {
  return applyDecorators(
    ApiOperation({
      summary: 'Filtrar casas editoriales con criterios avanzados - Acceso: ADMIN, USER',
      description:
        'Filtra casas editoriales utilizando criterios específicos como nombre, país, sitio web, fechas de creación y actualización.',
    }),
    ApiBody({
      type: PublishingHouseFiltersDto,
      description: 'Criterios de filtrado para las casas editoriales',
    }),
    ApiResponse({
      status: 200,
      description: 'Casas editoriales filtradas obtenidas exitosamente',
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
                    country: { type: 'string' },
                    foundedYear: { type: 'number' },
                    websiteUrl: { type: 'string' },
                    description: { type: 'string' },
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
