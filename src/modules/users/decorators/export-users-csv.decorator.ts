import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiQuery,
  ApiProduces,
} from '@nestjs/swagger';
import { UnauthorizedResponseDto, ForbiddenResponseDto } from '../../../common/dto';

export function ApiExportUsersCsv() {
  return applyDecorators(
    ApiOperation({
      summary: 'Exportar usuarios a CSV - Acceso: ADMIN',
      description:
        'Exporta la lista completa de usuarios a formato CSV con filtros opcionales para reporting y análisis administrativo. - Acceso: Solo administradores.',
    }),
    ApiBearerAuth(),
    ApiProduces('text/csv'),
    ApiQuery({
      name: 'name',
      description: 'Filtrar por nombre de usuario',
      required: false,
      type: String,
      example: 'Juan Pérez',
    }),
    ApiQuery({
      name: 'email',
      description: 'Filtrar por correo electrónico',
      required: false,
      type: String,
      example: 'juan.perez@example.com',
    }),
    ApiQuery({
      name: 'role',
      description: 'Filtrar por rol de usuario',
      required: false,
      enum: ['ADMIN', 'USER'],
      example: 'USER',
    }),
    ApiQuery({
      name: 'isActive',
      description: 'Filtrar por estado activo',
      required: false,
      type: Boolean,
      example: true,
    }),
    ApiQuery({
      name: 'createdDateFrom',
      description: 'Fecha inicial para filtro de fecha de creación',
      required: false,
      type: String,
      format: 'date',
      example: '2024-01-01',
    }),
    ApiQuery({
      name: 'createdDateTo',
      description: 'Fecha final para filtro de fecha de creación',
      required: false,
      type: String,
      format: 'date',
      example: '2024-12-31',
    }),
    ApiQuery({
      name: 'updatedDateFrom',
      description: 'Fecha inicial para filtro de última actualización',
      required: false,
      type: String,
      format: 'date',
      example: '2024-01-01',
    }),
    ApiQuery({
      name: 'updatedDateTo',
      description: 'Fecha final para filtro de última actualización',
      required: false,
      type: String,
      format: 'date',
      example: '2024-12-31',
    }),
    ApiResponse({
      status: 200,
      description: 'Archivo CSV con datos de usuarios filtrados',
      content: {
        'text/csv': {
          schema: {
            type: 'string',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT requerido',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Prohibido - Solo administradores pueden exportar CSV',
      type: ForbiddenResponseDto,
    }),
  );
}
