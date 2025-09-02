import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UnauthorizedResponseDto, ForbiddenResponseDto } from '../../../common/dto';

export function ApiSearchUsers() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Buscar usuarios - Acceso: ADMIN, USER',
      description: 'Busca usuarios por datos completos usando criterios exactos.',
    }),
    ApiResponse({
      status: 200,
      description: 'Resultados de búsqueda de usuarios obtenidos exitosamente',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      type: ForbiddenResponseDto,
    }),
  );
}
