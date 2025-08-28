import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
  ApiQuery
} from '@nestjs/swagger';
import { AuditLogListResponseDto } from '../dto/audit-response.dto';
import { ApiExtraModels } from "@nestjs/swagger";
import { PaginationDto } from '../../../common/dto';

export function ApiSearchAuditLogs() {
  return applyDecorators(
    ApiBearerAuth("JWT-auth"),
    ApiOperation({
      summary: "Buscar registros de auditoría - Acceso: ADMIN",
      description: "Busca registros de auditoría por término en el campo de detalles. Solo accesible para administradores.",
    }),
    ApiQuery({
      name: "term",
      required: true,
      type: String,
      description: "Término de búsqueda para filtrar por detalles de auditoría",
      example: "john_doe",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Resultados de búsqueda de auditoría obtenidos exitosamente",
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