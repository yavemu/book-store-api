import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiParam,
  getSchemaPath
} from '@nestjs/swagger';
import { ApiResponseDto , BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto} from '../../../common/dto';

export function ApiDeleteBook() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Eliminar libro del catálogo - Acceso: ADMIN',
      description: 'Elimina un libro del catálogo del sistema (eliminación lógica). Solo accesible para administradores.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único del libro a eliminar'}),
    ApiResponse({
      status: 200,
      description: 'Libro eliminado exitosamente del catálogo',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                },
              },
            },
          },
        ],
      },
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
  );
}