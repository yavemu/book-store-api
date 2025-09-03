import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Inject,
  Res,
  Param,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IAuditSearchService } from '../interfaces';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';
import {
  AuditFiltersDto,
  AuditExactSearchDto,
  AuditSimpleFilterDto,
  AuditCsvExportFiltersDto,
} from '../dto';
import { GetByIdParamDto } from '../../../common/dto/operation-param.dto';
import { FilterTermQueryDto } from '../../../common/dto/operation-query.dto';
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
  async getAll(@Query() pagination: PaginationInputDto, @Request() req): Promise<any> {
    return this.auditSearchService.getAuditTrail(pagination);
  }

  @Post('search')
  @Auth(UserRole.ADMIN)
  @ApiSearchAuditLogs()
  async getBySearch(
    @Body() searchDto: AuditExactSearchDto,
    @Query() pagination: PaginationInputDto,
    @Request() req,
  ): Promise<any> {
    return this.auditSearchService.exactSearch(searchDto);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN)
  @ApiFilterAuditRealtime()
  async getByFilterParam(
    @Query() termQuery: FilterTermQueryDto,
    @Query() pagination: PaginationInputDto,
    @Request() req,
  ): Promise<any> {
    return this.auditSearchService.simpleFilter(termQuery.term, pagination);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  @ApiGetAuditById()
  async getById(@Param() params: GetByIdParamDto, @Request() req): Promise<any> {
    return this.auditSearchService.getAuditById(params.id);
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN)
  @ApiAdvancedFilterAudit()
  async getByAdvancedFilter(
    @Body() filters: AuditFiltersDto,
    @Query() pagination: PaginationInputDto,
    @Request() req,
  ): Promise<any> {
    return this.auditSearchService.advancedFilter(filters, pagination);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportAuditCsv()
  async exportToCsv(
    @Query() filters: AuditCsvExportFiltersDto,
    @Res() res: Response,
    @Request() req,
  ): Promise<any> {
    return this.auditSearchService.exportToCsv(filters);
  }
}
