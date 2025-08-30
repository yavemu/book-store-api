import { Controller, Get, Post, Query, Body, Inject, Res, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IAuditSearchService } from '../interfaces/audit-search.service.interface';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { AuditFiltersDto } from '../dto/audit-filters.dto';
import { AuditCsvExportFiltersDto } from '../dto/audit-csv-export-filters.dto';
import {
  ApiGetAuditLogs,
  ApiSearchAuditLogs,
  ApiFilterAuditRealtime,
  ApiExportAuditCsv,
  ApiGetAuditById,
  ApiAdvancedFilterAudit,
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
  async findAll(@Query() pagination: PaginationDto) {
    return this.auditSearchService.getAuditTrail(pagination);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  @ApiGetAuditById()
  async findOne(@Param('id') id: string) {
    return this.auditSearchService.getAuditById(id);
  }

  @Get('search')
  @Auth(UserRole.ADMIN)
  @ApiSearchAuditLogs()
  async search(@Query('term') searchTerm: string, @Query() pagination: PaginationDto) {
    return this.auditSearchService.searchAuditLogs(searchTerm, pagination);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN)
  @ApiFilterAuditRealtime()
  async filter(@Query('filter') filterTerm: string, @Query() pagination: PaginationDto) {
    return this.auditSearchService.filterSearch(filterTerm, pagination);
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN)
  @ApiAdvancedFilterAudit()
  async advancedFilter(@Body() filters: AuditFiltersDto, @Query() pagination: PaginationDto) {
    return this.auditSearchService.findWithFilters(filters, pagination);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportAuditCsv()
  async exportToCsv(@Query() filters: AuditCsvExportFiltersDto, @Res() res: Response) {
    const csvData = await this.auditSearchService.exportToCsv(filters);
    const filename = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Add BOM for UTF-8 to ensure proper encoding in Excel
    const csvWithBom = '\uFEFF' + csvData;
    return res.send(csvWithBom);
  }
}
