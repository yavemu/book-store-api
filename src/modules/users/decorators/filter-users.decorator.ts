import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UnauthorizedResponseDto, ForbiddenResponseDto } from '../../../common/dto';

export function ApiFilterUsers() {
  return applyDecorators(
    ApiOperation({
      summary: 'Filtrar usuarios avanzado (Solo Administradores) - Acceso: ADMIN, USER',
      description:
        'Filtro avanzado de usuarios con múltiples criterios y paginación. ACCESO: Solo administradores.',
    }),
    ApiBearerAuth(),
    ApiBody({
      description: 'Criterios avanzados para filtrar usuarios',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', example: 'juan.perez@example.com' },
          role: { type: 'string', enum: ['ADMIN', 'USER'], example: 'USER' },
          isActive: { type: 'boolean', example: true },
          createdAfter: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00Z' },
          createdBefore: { type: 'string', format: 'date-time', example: '2024-12-31T23:59:59Z' },
        },
      },
    }),
    ApiQuery({
      name: 'page',
      description: 'Número de página',
      required: false,
      type: Number,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Elementos por página',
      required: false,
      type: Number,
      example: 10,
    }),
    ApiQuery({
      name: 'sortBy',
      description: 'Campo para ordenar',
      required: false,
      type: String,
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      description: 'Orden de clasificación',
      required: false,
      enum: ['ASC', 'DESC'],
      example: 'DESC',
    }),
    ApiResponse({
      status: 200,
      description: 'Usuarios filtrados con metadata de paginación',
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT requerido',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Prohibido - Solo administradores pueden usar filtros avanzados',
      type: ForbiddenResponseDto,
    }),
  );
}
