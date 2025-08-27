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

export function ApiGetAuditByEntity() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Obtener auditoría por entidad',
      description: 'Obtiene una lista paginada de registros de auditoría de una entidad específica. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'entityId',
      type: String,
      description: 'ID único de la entidad para obtener su auditoría (UUID)',
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
      description: 'Registros de auditoría de la entidad obtenidos exitosamente',
      type: AuditLogListResponseDto
    }),
    ApiUnauthorizedResponse({ 
      description: 'No autorizado - Token JWT inválido o faltante'
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador'
    }),
    ApiNotFoundResponse({
      description: 'Entidad no encontrada con el ID proporcionado'
    })
  );
}