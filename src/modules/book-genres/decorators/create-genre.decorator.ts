import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiBadRequestResponse, 
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiBearerAuth
} from '@nestjs/swagger';
import { BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto } from '../../../common/dto';

export function ApiCreateBookGenre() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Crear nuevo género de libro - Acceso: ADMIN',
      description: 'Crea un nuevo género de libro en el catálogo. Solo accesible para administradores.' 
    }),
    ApiResponse({
      status: 201,
      description: 'Género de libro creado exitosamente',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean'},
          message: {
            type: 'string',
          },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string'},
              name: { type: 'string'},
              description: {
                type: 'string',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Datos de entrada inválidos o errores de validación',
      type: BadRequestResponseDto,
    }),
    ApiConflictResponse({
      description: 'El género ya existe en el sistema',
      type: ConflictResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
  );
}