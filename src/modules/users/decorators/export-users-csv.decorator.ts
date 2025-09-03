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
import { UserCsvExportFiltersDto } from '../dto';
import { UnauthorizedResponseDto, ForbiddenResponseDto } from '../../../common/dto';

export function ApiExportUsersCsv() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Exportar usuarios a CSV - Acceso: ADMIN',
      description:
        'Exporta la lista completa de usuarios a formato CSV con filtros opcionales para reporting y análisis administrativo. - Acceso: Solo administradores.',
    }),
    ApiProduces('text/csv'),
    ApiQuery({ type: UserCsvExportFiltersDto }),
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
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos válidos',
      type: ForbiddenResponseDto,
    }),
  );
}
