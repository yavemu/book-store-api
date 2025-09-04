import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StandardResponseDto } from '../../../common/dto/paginated-response.dto';
import { RoleDataDto } from '../dto/role-data.dto';

export function ApiUpdateRole() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update role',
      description: 'Update role by ID - Access: ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Role updated successfully',
      type: StandardResponseDto<RoleDataDto>,
    }),
    ApiResponse({
      status: 404,
      description: 'Role not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Role name already exists',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad Request - Invalid input data',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing JWT token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Insufficient permissions',
    }),
    ApiBearerAuth('JWT-auth'),
  );
}