import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { UnauthorizedResponseDto, ForbiddenResponseDto } from '../../../common/dto';

export function ApiSearchUsers() {
  return applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({
      summary: 'Search users - Acceso: ADMIN, USER',
      description: 'Search users by term with pagination',
    }),
    ApiBearerAuth(),
    ApiQuery({
      name: 'term',
      description: 'Search term for username or email',
      required: true,
      type: String,
      example: 'john',
    }),
    ApiQuery({
      name: 'page',
      description: 'Page number',
      required: false,
      type: Number,
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Number of items per page',
      required: false,
      type: Number,
      example: 10,
    }),
    ApiQuery({
      name: 'sortBy',
      description: 'Sort by field',
      required: false,
      type: String,
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortOrder',
      description: 'Sort order',
      required: false,
      enum: ['ASC', 'DESC'],
      example: 'DESC',
    }),
    ApiResponse({
      status: 200,
      description: 'Users found with pagination metadata',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      type: UnauthorizedResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      type: ForbiddenResponseDto,
    }),
  );
}
