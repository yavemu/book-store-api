import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StandardResponseDto } from '../../../common/dto/paginated-response.dto';
import { RoleDataDto } from '../dto/role-data.dto';

export function ApiGetRoleById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get role by ID',
      description: 'Get role by ID - Access: ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Role retrieved successfully',
      type: StandardResponseDto<RoleDataDto>,
    }),
    ApiResponse({
      status: 404,
      description: 'Role not found',
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