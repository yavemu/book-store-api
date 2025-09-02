import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetAuditLogResponseDto } from '../dto/audit-response.dto';
import { UnauthorizedResponseDto, NotFoundResponseDto } from '../../../common/dto';

export function ApiGetAuditById() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
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
      type: GetAuditLogResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Log de auditoría no encontrado',
      type: NotFoundResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiBearerAuth(),
  );
}
