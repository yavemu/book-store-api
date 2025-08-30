import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuditLogListResponseDto } from '../dto/audit-response.dto';
import {
  PaginationDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';
import { ApiResponseDto } from '../../../common/dto';

export function ApiSearchAuditLogs() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Buscar registros de auditoría - Acceso: ADMIN',
      description:
        'Busca registros de auditoría por término en el campo de detalles. Solo accesible para administradores.',
    }),
    ApiQuery({
      name: 'term',
      required: true,
      type: String,
      description: 'Término de búsqueda para filtrar por detalles de auditoría',
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, AuditLogListResponseDto),
    ApiResponse({
      status: 200,
      description: 'Resultados de búsqueda de auditoría obtenidos exitosamente',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(AuditLogListResponseDto),
              },
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    }),
  );
}
