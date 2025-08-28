import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiExtraModels } from "@nestjs/swagger";
import { PublishingHouseListResponseDto } from '../dto';
import { PaginationDto } from "../../../common/dto/pagination.dto";

export function ApiGetPublishingHouses() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener lista de editoriales - Acceso: ADMIN, USER",
      description: "Obtiene una lista paginada de todas las editoriales registradas con filtros opcionales. Endpoint público.",
    }),
    ApiQuery({
      name: "search",
      required: false,
      type: String,
      description: "Término de búsqueda para filtrar por nombre de la editorial",
      example: "Penguin",
    }),
    ApiQuery({
      name: "country",
      required: false,
      type: String,
      description: "País para filtrar editoriales",
      example: "Estados Unidos",
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: "Lista de editoriales obtenida exitosamente",
      type: PublishingHouseListResponseDto,
    }),
  );
}