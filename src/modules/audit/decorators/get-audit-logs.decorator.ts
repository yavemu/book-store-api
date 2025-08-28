import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiExtraModels } from "@nestjs/swagger";
import { AuditLogListResponseDto } from '../dto/audit-response.dto';
import { PaginationDto } from "src/common/dto";

export function ApiGetAuditLogs() {
  return applyDecorators(
    ApiBearerAuth("JWT-auth"),
    ApiOperation({
      summary: "Obtener registros de auditoría - Acceso: ADMIN",
      description: "Obtiene una lista paginada de todos los registros de auditoría del sistema. Solo accesible para administradores.",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Registros de auditoría obtenidos exitosamente",
      type: AuditLogListResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: "No autorizado - Token JWT inválido o faltante",
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: 401 },
          message: { type: "string", example: "No autorizado" },
          error: { type: "string", example: "Sin autorización" },
        },
      },
    }),
    ApiForbiddenResponse({
      description: "Acceso denegado - Se requieren permisos de administrador",
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: 403 },
          message: { type: "string", example: "Acceso denegado" },
          error: { type: "string", example: "Prohibido" },
        },
      },
    }),
  );
}