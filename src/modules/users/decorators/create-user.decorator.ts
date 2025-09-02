import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserResponseDto } from '../dto/user-response.dto';
import {
  BadRequestResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
} from '../../../common/dto';

export function ApiCreateUser() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Crear nuevo usuario - Acceso: ADMIN',
      description:
        'Crea un nuevo usuario en el sistema con roles y permisos específicos. - Acceso: Solo administradores.',
    }),
    ApiResponse({
      status: 201,
      description: 'Usuario creado exitosamente',
      type: CreateUserResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos o errores de validación',
      type: BadRequestResponseDto,
    }),
    ApiConflictResponse({
      description: 'El usuario ya existe en el sistema',
      type: ConflictResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
  );
}
