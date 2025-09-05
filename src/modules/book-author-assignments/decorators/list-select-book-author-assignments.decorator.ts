import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ListSelectDto } from '../../../common/dto/list-select.dto';

export function ApiListSelectBookAuthorAssignments() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Obtener asignaciones libro-autor para selección - Acceso: ADMIN, USER',
      description:
        'Obtiene una lista de todas las asignaciones libro-autor activas formateada para componentes dropdown/select. Retorna solo id y nombre sin paginación.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de asignaciones libro-autor para selección obtenida exitosamente',
      type: [ListSelectDto],
    }),
    ApiBearerAuth(),
  );
}
