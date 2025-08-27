import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { AuditLogListResponseDto } from '../dto/audit-response.dto';

export function ApiGetAuditByUser() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Obtener auditoría por usuario - Acceso: ADMIN',
      description: 'Obtiene una lista paginada de registros de auditoría de un usuario específico. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'userId',
      type: String,
      description: 'ID único del usuario para obtener su auditoría (UUID)',
      example: 'b8c4e4b2-1234-5678-9abc-def123456789'
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número de página para la paginación',
      example: 1
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Número de elementos por página',
      example: 20
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Registros de auditoría del usuario obtenidos exitosamente',
      type: AuditLogListResponseDto
    }),
    ApiUnauthorizedResponse({ 
      description: 'No autorizado - Token JWT inválido o faltante'
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador'
    }),
    ApiNotFoundResponse({
      description: 'Usuario no encontrado con el ID proporcionado'
    })
  );
}