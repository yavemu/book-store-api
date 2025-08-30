import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiParam,
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

export function ApiGetAuditByEntityType() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener registros de auditoría por tipo de entidad - Acceso: ADMIN',
      description:
        'Obtiene una lista paginada de registros de auditoría filtrados por tipo de entidad. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'entityType',
      description: 'Tipo de entidad a filtrar (ej: User, BookCatalog, BookGenre)',
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, AuditLogListResponseDto),
    ApiResponse({
      status: 200,
      description: 'Registros de auditoría filtrados por tipo de entidad obtenidos exitosamente',
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
