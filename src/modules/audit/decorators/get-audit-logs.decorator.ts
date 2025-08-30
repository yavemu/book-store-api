import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuditLogListResponseDto } from '../dto/audit-response.dto';
import { PaginationDto } from '../../../common/dto';
import { UnauthorizedResponseDto } from '../../../common/dto/unauthorized-response.dto';
import { ApiResponseDto } from '../../../common/dto/api-response.dto';

export function ApiGetAuditLogs() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener registros de auditoría - Acceso: ADMIN',
      description:
        'Obtiene una lista paginada de todos los registros de auditoría del sistema. Solo accesible para administradores.',
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, AuditLogListResponseDto),
    ApiResponse({
      status: 200,
      description: 'Registros de auditoría obtenidos exitosamente',
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
      type: UnauthorizedResponseDto,
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
