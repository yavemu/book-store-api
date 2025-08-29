import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiExtraModels, ApiUnauthorizedResponse, ApiHeaders, ApiBody } from "@nestjs/swagger";
import { CsvExportFiltersDto } from '../dto';
import { BadRequestResponseDto, UnauthorizedResponseDto, ConflictResponseDto, ForbiddenResponseDto, NotFoundResponseDto} from '../../../common/dto';

export function ApiExportBooksCsv() {
  return applyDecorators(
    ApiOperation({
      summary: "Exportar catálogo de libros a CSV - Acceso: ADMIN, USER",
      description: `
        Exporta el catálogo de libros a formato CSV con filtros opcionales.
        
        **Filtros disponibles:**
        - Título del libro
        - Género (ID)
        - Editorial (ID) 
        - Disponibilidad
        - Rango de precios
        - Autor
        - Rango de fecha de publicación
        - Rango de fecha de creación
        
        **Formato del archivo CSV:**
        - Separador: coma (,)
        - Codificación: UTF-8
        - Headers incluidos: ID, Título, ISBN, Precio, Disponible, Stock, Género, Editorial, Fecha Publicación, Páginas, Fecha Creación, Resumen
      `,
    }),
    ApiExtraModels(CsvExportFiltersDto),
    ApiQuery({
      name: "title",
      required: false,
      type: String,
      description: "Filtrar por título del libro",
      example: "Harry Potter"
    }),
    ApiQuery({
      name: "genreId",
      required: false,
      type: String,
      description: "Filtrar por ID del género",
      example: "550e8400-e29b-41d4-a716-446655440000"
    }),
    ApiQuery({
      name: "publisherId",
      required: false,
      type: String,
      description: "Filtrar por ID de la editorial",
      example: "550e8400-e29b-41d4-a716-446655440001"
    }),
    ApiQuery({
      name: "isAvailable",
      required: false,
      type: Boolean,
      description: "Filtrar por disponibilidad",
      example: true
    }),
    ApiQuery({
      name: "minPrice",
      required: false,
      type: Number,
      description: "Precio mínimo",
      example: 10.00
    }),
    ApiQuery({
      name: "maxPrice",
      required: false,
      type: Number,
      description: "Precio máximo",
      example: 50.00
    }),
    ApiQuery({
      name: "author",
      required: false,
      type: String,
      description: "Filtrar por nombre del autor",
      example: "J.K. Rowling"
    }),
    ApiQuery({
      name: "publicationDateFrom",
      required: false,
      type: String,
      description: "Fecha de publicación desde (YYYY-MM-DD)",
      example: "2020-01-01"
    }),
    ApiQuery({
      name: "publicationDateTo",
      required: false,
      type: String,
      description: "Fecha de publicación hasta (YYYY-MM-DD)",
      example: "2023-12-31"
    }),
    ApiQuery({
      name: "createdDateFrom",
      required: false,
      type: String,
      description: "Fecha de creación desde (YYYY-MM-DD)",
      example: "2023-01-01"
    }),
    ApiQuery({
      name: "createdDateTo",
      required: false,
      type: String,
      description: "Fecha de creación hasta (YYYY-MM-DD)",
      example: "2023-12-31"
    }),
    ApiHeaders([
      {
        name: 'Content-Type',
        description: 'Tipo de contenido devuelto',
        schema: {
          type: 'string',
          example: 'text/csv; charset=utf-8'
        }
      },
      {
        name: 'Content-Disposition',
        description: 'Información de descarga del archivo',
        schema: {
          type: 'string',
          example: 'attachment; filename="catalogo-libros.csv"'
        }
      }
    ]),
    ApiResponse({
      status: 200,
      description: "Archivo CSV del catálogo de libros",
      content: {
        'text/csv': {
          schema: {
            type: 'string',
            example: `ID,Título,ISBN,Precio,Disponible,Stock,Género,Editorial,Fecha Publicación,Páginas,Fecha Creación,Resumen
"550e8400-e29b-41d4-a716-446655440000","El Quijote","9788423974944","29.95","Sí","50","Clásicos","Planeta","1605-01-01","863","2023-01-15","Las aventuras del ingenioso hidalgo..."`
          }
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: "Parámetros de filtro inválidos",
      type: BadRequestResponseDto,
    }),
    ApiUnauthorizedResponse({
      description: "No autorizado - Token JWT inválido o faltante",
      type: UnauthorizedResponseDto,
    }),
    ApiResponse({
      status: 403,
      description: "Acceso prohibido - Sin permisos suficientes",
      type: ForbiddenResponseDto,
    }),
    ApiResponse({
      status: 500,
      description: "Error interno del servidor",
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: 500 },
          message: { type: "string", example: "Failed to export books to CSV" },
        },
      },
    }),
  );
}