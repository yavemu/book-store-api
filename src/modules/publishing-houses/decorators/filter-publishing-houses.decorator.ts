import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PublishingHouseFiltersDto, PublishingHouseListResponseDto } from '../dto';
import {
  PaginationInputDto,
  UnauthorizedResponseDto,
  ForbiddenResponseDto,
} from '../../../common/dto';

export function ApiFilterPublishingHouses() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Filtrar casas editoriales con criterios avanzados - Acceso: ADMIN, USER',
      description:
        'Filtra casas editoriales utilizando criterios específicos como nombre, país, sitio web, fechas de creación y actualización.',
    }),
    ApiBody({
      type: PublishingHouseFiltersDto,
      description: 'Criterios de filtrado para las casas editoriales',
    }),
    ApiQuery({ type: PaginationInputDto }),
    ApiResponse({
      status: 200,
      description: 'Casas editoriales filtradas obtenidas exitosamente',
      type: PublishingHouseListResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: 'No autorizado - Token JWT inválido o faltante',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Acceso denegado - Se requieren permisos válidos',
      type: ForbiddenResponseDto,
    }),
  );
}
