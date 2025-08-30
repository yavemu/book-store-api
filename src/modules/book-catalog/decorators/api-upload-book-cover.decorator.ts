import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UploadBookCoverDto } from '../dto/upload-book-cover.dto';

export function ApiUploadBookCover() {
  return applyDecorators(
    ApiOperation({
      summary: 'Subir imagen de portada de libro - Acceso: ADMIN',
      description:
        'Sube o reemplaza la imagen de portada para un libro específico. Soporta formatos JPEG, PNG, WebP y GIF hasta 5MB. - Acceso: Solo administradores y gestores de inventario.',
    }),
    ApiParam({
      name: 'id',
      description: 'UUID of the book to upload cover for',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Book cover image file',
      type: UploadBookCoverDto,
      schema: {
        type: 'object',
        properties: {
          coverImage: {
            type: 'string',
            format: 'binary',
            description: 'Book cover image file (JPEG, PNG, WebP, GIF - max 5MB)',
          },
        },
        required: ['coverImage'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Book cover uploaded successfully and book updated',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Book cover uploaded successfully' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
              title: { type: 'string', example: 'The Shining' },
              coverImageUrl: {
                type: 'string',
                example: '/uploads/books/the_shining.cover_image.jpg',
              },
            },
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid file format, size, or missing file',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example:
              'Invalid file type. Allowed types: image/jpeg, image/png, image/webp, image/gif',
          },
          statusCode: { type: 'number', example: 400 },
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
