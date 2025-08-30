import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookAuthorListResponseDto } from '../dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export function ApiGetAuthors() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener lista de autores - Acceso: ADMIN, USER',
      description:
        'Obtiene una lista paginada de todos los autores registrados con filtros opcionales. Endpoint público.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Término de búsqueda para filtrar por nombre o apellido',
    }),
    ApiQuery({
      name: 'nationality',
      required: false,
      type: String,
      description: 'Nacionalidad para filtrar autores',
    }),
    ApiExtraModels(PaginationDto),
    ApiResponse({
      status: 200,
      description: 'Lista de autores obtenida exitosamente',
      type: BookAuthorListResponseDto,
    }),
    ApiBearerAuth(),
  );
}
