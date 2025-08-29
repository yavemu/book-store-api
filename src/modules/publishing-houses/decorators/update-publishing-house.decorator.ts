import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse, 
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiParam
} from '@nestjs/swagger';
import { BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto } from '../../../common/dto';
import { UpdatePublishingHouseResponseDto } from '../dto';

export function ApiUpdatePublishingHouse() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Actualizar información de la editorial - Acceso: ADMIN',
      description: 'Actualiza la información de una editorial existente. Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único de la editorial a actualizar'}),
    ApiResponse({ 
      status: 200, 
      description: 'Editorial actualizada exitosamente',
      type: UpdatePublishingHouseResponseDto
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos o errores de validación',
      type: BadRequestResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Editorial no encontrada',
      type: NotFoundResponseDto,
    }),
    ApiConflictResponse({
      description: 'Ya existe otra editorial con el mismo nombre',
      type: ConflictResponseDto,
    }),
  );
}