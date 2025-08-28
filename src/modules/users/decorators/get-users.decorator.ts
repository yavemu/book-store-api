import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiBearerAuth, ApiExtraModels } from "@nestjs/swagger";
import { UserListResponseDto } from "../dto";
import { PaginationDto } from "../../../common/dto";

export function ApiGetUsers() {
  return applyDecorators(
    ApiBearerAuth("JWT-auth"),
    ApiOperation({
      summary: "Obtener lista de usuarios - Acceso: ADMIN",
      description: "Obtiene una lista paginada de todos los usuarios del sistema. Solo accesible para administradores.",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Lista de usuarios obtenida exitosamente",
      type: UserListResponseDto,
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