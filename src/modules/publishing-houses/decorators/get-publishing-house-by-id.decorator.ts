import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse,
  ApiNotFoundResponse,
  ApiParam
} from '@nestjs/swagger';
import { BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto } from '../../../common/dto';
import { PublishingHouseResponseDto } from '../dto';

export function ApiGetPublishingHouseById() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Obtener editorial por ID - Acceso: ADMIN, USER',
      description: 'Obtiene los detalles completos de una editorial específica usando su ID único. Endpoint público.' 
    }),
    ApiParam({
      name: 'id',
      type: String,
      description: 'ID único de la editorial'}),
    ApiResponse({ 
      status: 200, 
      description: 'Editorial encontrada y devuelta exitosamente',
      type: PublishingHouseResponseDto
    }),
    ApiNotFoundResponse({
      description: 'Editorial no encontrada',
      type: NotFoundResponseDto,
    }),
  );
}