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
import { PaginationDto , BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto} from '../../../common/dto';
import { ApiResponseDto } from '../../../common/dto';

export function ApiGetAuditByAction() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener registros de auditoría por acción - Acceso: ADMIN',
      description:
        'Obtiene una lista paginada de registros de auditoría filtrados por tipo de acción. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'action',
      description: 'Tipo de acción de auditoría a filtrar',
      enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'REGISTER'],
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, AuditLogListResponseDto),
    ApiResponse({
      status: 200,
      description:
        'Registros de auditoría filtrados por acción obtenidos exitosamente',
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
          statusCode: { type: 'number'},
          message: { type: 'string'},
          error: { type: 'string'},
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number'},
          message: { type: 'string'},
          error: { type: 'string'},
        },
      },
    }),
  );
}