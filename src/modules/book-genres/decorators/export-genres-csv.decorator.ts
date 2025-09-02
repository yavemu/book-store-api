import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiProduces,
} from '@nestjs/swagger';

export function ApiExportGenresCsv() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Exportar géneros a CSV - Acceso: ADMIN',
      description:
        'Exporta la lista de géneros en formato CSV aplicando filtros opcionales para generar reportes.',
    }),
    ApiQuery({
      name: 'name',
      required: false,
      type: String,
      description: 'Filtrar por nombre del género',
    }),
    ApiQuery({
      name: 'description',
      required: false,
      type: String,
      description: 'Filtrar por contenido de la descripción',
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
          schema: { type: 'string', example: 'attachment; filename="book_genres_2024-01-01.csv"' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
    }),
    ApiBearerAuth(),
  );
}
