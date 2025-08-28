import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiParam, ApiExtraModels } from "@nestjs/swagger";
import { AuditLogListResponseDto } from '../dto/audit-response.dto';
import { PaginationDto } from "../../../common/dto/pagination.dto";

export function ApiGetAuditByEntityType() {
  return applyDecorators(
    ApiBearerAuth("JWT-auth"),
    ApiOperation({
      summary: "Obtener registros de auditoría por tipo de entidad - Acceso: ADMIN",
      description: "Obtiene una lista paginada de registros de auditoría filtrados por tipo de entidad. Solo accesible para administradores.",
    }),
    ApiParam({
      name: "entityType",
      description: "Tipo de entidad a filtrar (ej: User, BookCatalog, BookGenre)",
      example: "User",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Registros de auditoría filtrados por tipo de entidad obtenidos exitosamente",
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