import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiUnauthorizedResponse, ApiExtraModels } from "@nestjs/swagger";
import { PublishingHouseListResponseDto } from '../dto';
import { PaginationDto } from "../../../common/dto/pagination.dto";

export function ApiGetPublishingHousesByCountry() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener editoriales por país - Acceso: ADMIN, USER",
      description: "Obtiene una lista paginada de editoriales filtradas por un país específico.",
    }),
    ApiParam({
      name: "country",
      description: "Nombre del país para filtrar las editoriales",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Editoriales del país especificado obtenidas exitosamente",
      type: PublishingHouseListResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: "No autorizado - Token JWT inválido o faltante",
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number"},
          message: { type: "string"},
        },
      },
    }),
  );
}