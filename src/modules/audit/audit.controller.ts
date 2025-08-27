import { Controller, Get, Query, Param } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { AuditLogService } from './services/audit-log.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../users/entities/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { AuditAction } from './entities/audit-log.entity';

@ApiTags('Audit Logs')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get all audit logs (Admin only)',
    description: 'Retrieve a paginated list of all audit logs. Requires admin role.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Audit logs retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid-string' },
              performedBy: { type: 'string', example: 'user-uuid' },
              entityId: { type: 'string', example: 'entity-uuid' },
              action: { type: 'string', example: 'CREATE', enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'REGISTER'] },
              details: { type: 'string', example: 'User created: john_doe (john@example.com)' },
              entityType: { type: 'string', example: 'User' },
              createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' }
            }
          }
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 10 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin role required' })
  async getAuditTrail(@Query() pagination: PaginationDto) {
    return this.auditLogService.getAuditTrail(pagination);
  }

  @Get('user/:userId')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'userId', description: 'User UUID', example: 'uuid-string' })
  @ApiOperation({ 
    summary: 'Get audit logs for specific user (Admin only)',
    description: 'Retrieve audit logs for a specific user. Requires admin role.' 
  })
  @ApiResponse({ status: 200, description: 'User audit logs retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin role required' })
  async getUserAuditHistory(
    @Param('userId') userId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.auditLogService.getUserAuditHistory(userId, pagination);
  }

  @Get('entity/:entityId')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'entityId', description: 'Entity UUID', example: 'uuid-string' })
  @ApiOperation({ 
    summary: 'Get audit logs for specific entity (Admin only)',
    description: 'Retrieve audit logs for a specific entity. Requires admin role.' 
  })
  @ApiResponse({ status: 200, description: 'Entity audit logs retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin role required' })
  async getEntityAuditHistory(
    @Param('entityId') entityId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.auditLogService.getEntityAuditHistory(entityId, pagination);
  }

  @Get('action/:action')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ 
    name: 'action', 
    description: 'Audit action type', 
    example: 'CREATE',
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'REGISTER']
  })
  @ApiOperation({ 
    summary: 'Get audit logs by action (Admin only)',
    description: 'Retrieve audit logs filtered by action type. Requires admin role.' 
  })
  @ApiResponse({ status: 200, description: 'Action audit logs retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin role required' })
  async getAuditsByAction(
    @Param('action') action: AuditAction,
    @Query() pagination: PaginationDto,
  ) {
    return this.auditLogService.getAuditsByAction(action, pagination);
  }

  @Get('type/:entityType')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'entityType', description: 'Entity type', example: 'User' })
  @ApiOperation({ 
    summary: 'Get audit logs by entity type (Admin only)',
    description: 'Retrieve audit logs filtered by entity type. Requires admin role.' 
  })
  @ApiResponse({ status: 200, description: 'Entity type audit logs retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin role required' })
  async getAuditsByEntityType(
    @Param('entityType') entityType: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.auditLogService.getAuditsByEntityType(entityType, pagination);
  }

  @Get('search')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiQuery({ name: 'term', description: 'Search term', example: 'john_doe' })
  @ApiOperation({ 
    summary: 'Search audit logs (Admin only)',
    description: 'Search audit logs by term in details field. Requires admin role.' 
  })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin role required' })
  async searchAuditLogs(
    @Query('term') searchTerm: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.auditLogService.searchAuditLogs(searchTerm, pagination);
  }
}