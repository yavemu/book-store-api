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
  ApiParam,
  getSchemaPath,
} from '@nestjs/swagger';
import { BookCatalogResponseDto } from '../dto';
import {
  ApiResponseDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
  ForbiddenResponseDto,
  NotFoundResponseDto,
} from '../../../common/dto';

export function ApiUpdateBook() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Actualizar libro del catálogo - Acceso: ADMIN',
      description:
        'Actualiza la información de un libro existente en el catálogo. Solo accesible para administradores.',
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del libro a actualizar',
    }),
    ApiResponse({
      status: 200,
      description: 'Libro actualizado exitosamente',
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
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos de administrador',
      type: ForbiddenResponseDto,
    }),
    ApiNotFoundResponse({
      description: 'Libro no encontrado en el catálogo',
      type: NotFoundResponseDto,
    }),
    ApiConflictResponse({
      description: 'El código ISBN ya está en uso por otro libro',
      type: ConflictResponseDto,
    }),
  );
}
