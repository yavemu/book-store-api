import { Controller, Get, Post, Query, Body, Inject, Res, Param, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IAuditSearchService } from '../interfaces/audit-search.service.interface';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import {
  AuditFiltersDto,
  AuditExactSearchDto,
  AuditSimpleFilterDto,
  AuditCsvExportFiltersDto,
} from '../dto';
import { FileExportService } from '../../../common/services/file-export.service';
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
    private readonly fileExportService: FileExportService,
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

  @Post('search')
  @HttpCode(200)
  @Auth(UserRole.ADMIN)
  @ApiSearchAuditLogs()
  async exactSearch(@Body() searchDto: AuditExactSearchDto) {
    return this.auditSearchService.exactSearch(searchDto);
  }

  @Post('filter')
  @HttpCode(200)
  @Auth(UserRole.ADMIN)
  @ApiFilterAuditRealtime()
  async simpleFilter(@Body() filterDto: AuditSimpleFilterDto) {
    return this.auditSearchService.simpleFilter(filterDto);
  }

  @Post('advanced-filter')
  @HttpCode(200)
  @Auth(UserRole.ADMIN)
  @ApiAdvancedFilterAudit()
  async advancedFilter(@Body() filters: AuditFiltersDto, @Query() pagination: PaginationDto) {
    return this.auditSearchService.advancedFilter(filters, pagination);
  }

  // Legacy method names for backward compatibility with tests
  async search(searchTerm: any, pagination: PaginationDto) {
    return this.exactSearch(searchTerm);
  }

  async filter(filterTerm: any, pagination: PaginationDto) {
    return this.simpleFilter(filterTerm);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportAuditCsv()
  async exportToCsv(@Query() filters: AuditCsvExportFiltersDto, @Res() res: Response) {
    const csvData = await this.auditSearchService.exportToCsv(filters);
    const filename = this.fileExportService.generateDateBasedFilename('audit_logs', 'csv');

    this.fileExportService.exportToCsv(res, {
      content: csvData,
      filename,
      type: 'csv',
    });
  }
}
