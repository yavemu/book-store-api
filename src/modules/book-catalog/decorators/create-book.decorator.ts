import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  getSchemaPath,
} from '@nestjs/swagger';
import { BookCatalogResponseDto } from '../dto';
import {
  ApiResponseDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
} from '../../../common/dto';

export function ApiCreateBook() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Crear nuevo libro en el catálogo - Acceso: ADMIN',
      description:
        'Crea un nuevo libro en el catálogo del sistema con toda la información bibliográfica requerida. - Acceso: Solo administradores y gestores de inventario.',
    }),
    ApiResponse({
      status: 201,
      description: 'Libro creado exitosamente en el catálogo',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(BookCatalogResponseDto),
              },
            },
          },
        ],
      },
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
      description: 'El código ISBN ya existe en el catálogo',
      type: ConflictResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
  );
}
