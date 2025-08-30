import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export function ApiGetAuditById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener log de auditoría por ID - Acceso: ADMIN',
      description: 'Obtiene los detalles específicos de un log de auditoría mediante su ID único.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del log de auditoría',
    }),
    ApiResponse({
      status: 200,
      description: 'Log de auditoría encontrado exitosamente',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          entityId: { type: 'string', format: 'uuid' },
          entityType: { type: 'string' },
          action: { type: 'string' },
          changes: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' },
          metadata: { type: 'object' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Log de auditoría no encontrado',
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
    }),
    ApiBearerAuth(),
  );
}