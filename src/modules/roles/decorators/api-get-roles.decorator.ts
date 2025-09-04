import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StandardResponseDto } from '../../../common/dto/paginated-response.dto';
import { RolesListDataDto } from '../dto/roles-list-data.dto';

export function ApiGetRoles() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all roles',
      description: 'Get paginated list of roles - Access: ADMIN',
    }),
    ApiResponse({
      status: 200,
      description: 'Roles retrieved successfully',
      type: StandardResponseDto<RolesListDataDto>,
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