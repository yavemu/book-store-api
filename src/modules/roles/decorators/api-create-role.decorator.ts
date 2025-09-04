import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StandardResponseDto } from '../../../common/dto/paginated-response.dto';
import { RoleDataDto } from '../dto/role-data.dto';

export function ApiCreateRole() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create role',
      description: 'Create a new role - Access: ADMIN',
    }),
    ApiResponse({
      status: 201,
      description: 'Role created successfully',
      type: StandardResponseDto<RoleDataDto>,
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