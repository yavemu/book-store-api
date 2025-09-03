import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiProduces,
} from '@nestjs/swagger';
import { BookAuthorCsvExportFiltersDto } from '../dto';
import { UnauthorizedResponseDto, ForbiddenResponseDto } from '../../../common/dto';

export function ApiExportAuthorsCsv() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Exportar autores a CSV - Acceso: ADMIN',
      description:
        'Exporta la lista de autores en formato CSV aplicando filtros opcionales para generar reportes.',
    }),
    ApiProduces('text/csv'),
    ApiQuery({ type: BookAuthorCsvExportFiltersDto }),
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
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos válidos',
      type: ForbiddenResponseDto,
    }),
  );
}
