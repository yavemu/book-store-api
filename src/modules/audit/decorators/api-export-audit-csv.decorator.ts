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

export function ApiExportAuditCsv() {
  return applyDecorators(
    ApiOperation({
      summary: 'Exportar auditoría a CSV (Solo Administradores) - Acceso: ADMIN',
      description:
        'Exporta los registros de auditoría filtrados a formato CSV con soporte para rango de fechas. ACCESO: Solo administradores.',
    }),
    ApiBearerAuth(),
    ApiProduces('text/csv'),
    ApiQuery({
      name: 'action',
      description: 'Filtrar por tipo de acción',
      required: false,
      enum: ['CREATE', 'UPDATE', 'DELETE'],
      example: 'CREATE',
    }),
    ApiQuery({
      name: 'entityType',
      description: 'Filtrar por tipo de entidad',
      required: false,
      type: String,
      example: 'User',
    }),
    ApiQuery({
      name: 'entityId',
      description: 'Filtrar por ID de entidad específica',
      required: false,
      type: String,
      example: 'user-uuid-123',
    }),
    ApiQuery({
      name: 'performedBy',
      description: 'Filtrar por usuario que realizó la acción',
      required: false,
      type: String,
      example: 'admin-uuid-456',
    }),
    ApiQuery({
      name: 'startDate',
      description: 'Fecha inicial para filtro de rango de fechas',
      required: false,
      type: String,
      format: 'date-time',
      example: '2024-01-01T00:00:00Z',
    }),
    ApiQuery({
      name: 'endDate',
      description: 'Fecha final para filtro de rango de fechas',
      required: false,
      type: String,
      format: 'date-time',
      example: '2024-12-31T23:59:59Z',
    }),
    ApiResponse({
      status: 200,
      description: 'Archivo CSV con datos de auditoría filtrados',
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
      description: 'Prohibido - Solo administradores pueden exportar auditorías',
      type: ForbiddenResponseDto,
    }),
  );
}
