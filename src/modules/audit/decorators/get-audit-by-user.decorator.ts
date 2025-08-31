import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuditLogListResponseDto } from '../dto/audit-response.dto';
import { PaginationDto } from '../../../common/dto';
import { ApiResponseDto } from '../../../common/dto';

export function ApiGetAuditByUser() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener auditoría por usuario - Acceso: ADMIN',
      description:
        'Obtiene una lista paginada de registros de auditoría de un usuario específico. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      description: 'ID único del usuario para obtener su auditoría (UUID)',
    }),
    ApiExtraModels(PaginationDto, ApiResponseDto, AuditLogListResponseDto),
    ApiResponse({
      status: 200,
      description: 'Registros de auditoría del usuario obtenidos exitosamente',
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
      description: 'Usuario no encontrado con el ID proporcionado',
    }),
  );
}
