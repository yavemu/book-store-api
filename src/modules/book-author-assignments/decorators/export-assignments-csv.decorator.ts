import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiProduces,
} from '@nestjs/swagger';

export function ApiExportAssignmentsCsv() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Exportar asignaciones libro-autor a CSV - Acceso: ADMIN',
      description:
        'Exporta la lista de asignaciones entre libros y autores en formato CSV aplicando filtros opcionales para generar reportes.',
    }),
    ApiQuery({
      name: 'bookId',
      required: false,
      type: String,
      description: 'Filtrar por ID del libro',
    }),
    ApiQuery({
      name: 'authorId',
      required: false,
      type: String,
      description: 'Filtrar por ID del autor',
    }),
    ApiQuery({
      name: 'startDate',
      required: false,
      type: String,
      description: 'Fecha de inicio para el rango de fechas de creación de asignaciones',
    }),
    ApiQuery({
      name: 'endDate',
      required: false,
      type: String,
      description: 'Fecha de fin para el rango de fechas de creación de asignaciones',
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
            example: 'attachment; filename="book_author_assignments_2024-01-01.csv"',
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
