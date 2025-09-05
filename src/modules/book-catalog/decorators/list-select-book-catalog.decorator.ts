import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ListSelectDto } from '../../../common/dto/list-select.dto';

export function ApiListSelectBookCatalog() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener libros para selección - Acceso: ADMIN, USER',
      description:
        'Obtiene una lista de todos los libros activos formateada para componentes dropdown/select. Retorna solo id y nombre sin paginación.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de libros para selección obtenida exitosamente',
      type: [ListSelectDto],
    }),
    ApiBearerAuth(),
  );
}
