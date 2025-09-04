import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StandardResponseDto } from '../../../common/dto/paginated-response.dto';

export function ApiDeleteRole() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete role',
      description: 'Soft delete role by ID - Access: ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Role deleted successfully',
      type: StandardResponseDto<{ id: string }>,
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