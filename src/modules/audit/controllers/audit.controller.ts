import { Controller, Get, Query, Param, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IAuditSearchService } from '../interfaces/audit-search.service.interface';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { AuditAction } from '../enums/audit-action.enum';
import {
  ApiGetAuditLogs,
  ApiGetAuditByUser,
  ApiGetAuditByEntity,
  ApiGetAuditByAction,
  ApiGetAuditByEntityType,
  ApiSearchAuditLogs,
} from '../decorators';

@ApiTags('Audit Logs')
@Controller('audit')
export class AuditController {
  constructor(
    @Inject('IAuditSearchService')
    private readonly auditSearchService: IAuditSearchService,
  ) {}

  @Get()
  @Auth(UserRole.ADMIN)
  @ApiGetAuditLogs()
  async getAuditTrail(@Query() pagination: PaginationDto) {
    return this.auditSearchService.getAuditTrail(pagination);
  }

  @Get('user/:userId')
  @Auth(UserRole.ADMIN)
  @ApiGetAuditByUser()
  async getUserAuditHistory(
    @Param('userId') userId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.auditSearchService.getUserAuditHistory(userId, pagination);
  }

  @Get('entity/:entityId')
  @Auth(UserRole.ADMIN)
  @ApiGetAuditByEntity()
  async getEntityAuditHistory(
    @Param('entityId') entityId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.auditSearchService.getEntityAuditHistory(entityId, pagination);
  }

  @Get('action/:action')
  @Auth(UserRole.ADMIN)
  @ApiGetAuditByAction()
  async getAuditsByAction(
    @Param('action') action: AuditAction,
    @Query() pagination: PaginationDto,
  ) {
    return this.auditSearchService.getAuditsByAction(action, pagination);
  }

  @Get('type/:entityType')
  @Auth(UserRole.ADMIN)
  @ApiGetAuditByEntityType()
  async getAuditsByEntityType(
    @Param('entityType') entityType: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.auditSearchService.getAuditsByEntityType(entityType, pagination);
  }

  @Get('search')
  @Auth(UserRole.ADMIN)
  @ApiSearchAuditLogs()
  async searchAuditLogs(
    @Query('term') searchTerm: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.auditSearchService.searchAuditLogs(searchTerm, pagination);
  }
}