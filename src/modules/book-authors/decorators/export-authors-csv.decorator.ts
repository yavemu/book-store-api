import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiProduces,
} from '@nestjs/swagger';

export function ApiExportAuthorsCsv() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Exportar autores a CSV - Acceso: ADMIN',
      description:
        'Exporta la lista de autores en formato CSV aplicando filtros opcionales para generar reportes.',
    }),
    ApiQuery({
      name: 'name',
      required: false,
      type: String,
      description: 'Filtrar por nombre del autor',
    }),
    ApiQuery({
      name: 'nationality',
      required: false,
      type: String,
      description: 'Filtrar por nacionalidad',
    }),
    ApiQuery({
      name: 'isActive',
      required: false,
      type: Boolean,
      description: 'Filtrar por estado activo/inactivo',
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
          schema: { type: 'string', example: 'attachment; filename="book_authors_2024-01-01.csv"' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
    }),
    ApiBearerAuth(),
  );
}
