import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiParam,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { AuditLogListResponseDto } from '../dto/audit-response.dto';
import { PaginationDto , BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto} from '../../../common/dto';
import { ApiResponseDto } from '../../../common/dto';

export function ApiGetAuditByEntity() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener auditoría por entidad - Acceso: ADMIN',
      description:
        'Obtiene una lista paginada de registros de auditoría de una entidad específica. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'entityId',
      type: String,
      description: 'ID único de la entidad para obtener su auditoría (UUID)',
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, AuditLogListResponseDto),
    ApiResponse({
      status: 200,
      description: 'Registros de auditoría de la entidad obtenidos exitosamente',
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
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
    }),
    ApiNotFoundResponse({
      description: 'Entidad no encontrada con el ID proporcionado',
    }),
  );
}