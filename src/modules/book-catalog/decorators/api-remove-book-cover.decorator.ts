import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

export function ApiRemoveBookCover() {
  return applyDecorators(
    ApiOperation({
      summary: 'Eliminar imagen de portada de libro - Acceso: ADMIN',
      description:
        'Elimina la imagen de portada de un libro específico y borra el archivo del almacenamiento. - Acceso: Solo administradores y gestores de inventario.',
    }),
    ApiParam({
      name: 'id',
      description: 'UUID of the book to remove cover from',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
      status: 200,
      description: 'Book cover removed successfully',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Book cover removed successfully' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
              title: { type: 'string', example: 'The Shining' },
              coverImageUrl: { type: 'string', nullable: true, example: null },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'No cover image to remove',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'No cover image to remove' },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Authentication required',
    }),
    ApiForbiddenResponse({
      description: 'Admin role required',
    }),
    ApiNotFoundResponse({
      description: 'Book not found',
    }),
    ApiBearerAuth('JWT-auth'),
  );
}
