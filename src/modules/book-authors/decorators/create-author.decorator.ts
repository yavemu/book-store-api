import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse, 
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto } from '../../../common/dto';
import { CreateBookAuthorResponseDto } from '../dto';

export function ApiCreateAuthor() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Crear nuevo autor - Acceso: ADMIN',
      description: 'Crea un nuevo autor en el sistema. Solo accesible para administradores.' 
    }),
    ApiResponse({ 
      status: 201, 
      description: 'Autor creado exitosamente',
      type: CreateBookAuthorResponseDto
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
      description: 'El autor ya existe en el sistema',
      type: ConflictResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
  );
}