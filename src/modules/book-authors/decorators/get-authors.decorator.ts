import { applyDecorators } from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiQuery
} from '@nestjs/swagger';
import { BookAuthorListResponseDto } from '../dto';

export function ApiGetAuthors() {
  return applyDecorators(
    ApiOperation({
      summary: "Obtener lista de autores - Acceso: ADMIN, USER",
      description: "Obtiene una lista paginada de todos los autores registrados con filtros opcionales. Endpoint público.",
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
      example: "lastName",
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
      description: "Término de búsqueda para filtrar por nombre o apellido",
      example: "Stephen King",
    }),
    ApiQuery({
      name: "nationality",
      required: false,
      type: String,
      description: "Nacionalidad para filtrar autores",
      example: "Estadounidense",
    }),
    ApiResponse({
      status: 200,
      description: "Lista de autores obtenida exitosamente",
      type: BookAuthorListResponseDto,
    }),
  );
}