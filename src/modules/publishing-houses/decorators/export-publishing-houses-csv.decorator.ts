import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiProduces,
} from '@nestjs/swagger';

export function ApiExportPublishingHousesCsv() {
  return applyDecorators(
    ApiOperation({
      summary: 'Exportar casas editoriales a CSV - Acceso: ADMIN',
      description:
        'Exporta la lista de casas editoriales en formato CSV aplicando filtros opcionales para generar reportes.',
    }),
    ApiQuery({
      name: 'name',
      required: false,
      type: String,
      description: 'Filtrar por nombre de la casa editorial',
    }),
    ApiQuery({
      name: 'country',
      required: false,
      type: String,
      description: 'Filtrar por país',
    }),
    ApiQuery({
      name: 'websiteUrl',
      required: false,
      type: String,
      description: 'Filtrar por URL del sitio web',
    }),
    ApiQuery({
      name: 'startDate',
      required: false,
      type: String,
      description: 'Fecha de inicio para el rango de fechas de creación',
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      type: String,
      description: 'Fecha de fin para el rango de fechas de creación',
    }),
    ApiProduces('text/csv'),
    ApiResponse({
      status: 200,
      description: 'Archivo CSV generado exitosamente',
      content: {
        'text/csv': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      headers: {
        'Content-Type': {
          description: 'Tipo de contenido',
          schema: { type: 'string', example: 'text/csv' },
        },
        'Content-Disposition': {
          description: 'Disposición del contenido para descarga',
          schema: {
            type: 'string',
            example: 'attachment; filename="publishing_houses_2024-01-01.csv"',
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
    }),
    ApiBearerAuth(),
  );
}
