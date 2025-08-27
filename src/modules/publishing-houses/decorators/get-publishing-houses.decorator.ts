import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiQuery
} from '@nestjs/swagger';
import { PublishingHouseListResponseDto } from '../dto';

export function ApiGetPublishingHouses() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener lista de editoriales",
      description: "Obtiene una lista paginada de todas las editoriales registradas con filtros opcionales. Endpoint público.",
    }),
    ApiQuery({
      name: "page",
      required: false,
      type: Number,
      description: "Número de página para la paginación",
      example: 1,
    }),
    ApiQuery({
      name: "limit",
      required: false,
      type: Number,
      description: "Número de elementos por página (máximo 100)",
      example: 10,
    }),
    ApiQuery({
      name: "sortBy",
      required: false,
      type: String,
      description: "Campo por el cual ordenar los resultados",
      example: "name",
    }),
    ApiQuery({
      name: "sortOrder",
      required: false,
      enum: ["ASC", "DESC"],
      description: "Orden de clasificación ascendente o descendente",
      example: "ASC",
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
    ApiResponse({
      status: 200,
      description: "Lista de editoriales obtenida exitosamente",
      type: PublishingHouseListResponseDto,
    }),
  );
}