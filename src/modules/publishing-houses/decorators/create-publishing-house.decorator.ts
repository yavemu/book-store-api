import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';
import { CreatePublishingHouseResponseDto } from '../dto';

export function ApiCreatePublishingHouse() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Crear nueva editorial - Acceso: ADMIN',
      description: 'Crea una nueva editorial en el sistema. Solo accesible para administradores.',
    }),
    ApiResponse({
      status: 201,
      description: 'Editorial creada exitosamente',
      type: CreatePublishingHouseResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos o errores de validación',
      type: BadRequestResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiConflictResponse({
      description: 'La editorial ya existe en el sistema',
      type: ConflictResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
  );
}
