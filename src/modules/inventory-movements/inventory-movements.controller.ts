import {
  Controller,
  Get,
  Param,
  Query,
  Request,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { InventoryMovementCrudService } from './services/inventory-movement-crud.service';
import { IInventoryMovementSearchRepository } from './interfaces';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginationInputDto } from '../../common/dto/pagination-input.dto';
import { SUCCESS_MESSAGES } from '../../common/constants/success-messages';
import { FileExportService } from '../../common/services/file-export.service';
import {
  ApiGetInventoryMovements,
  ApiGetInventoryMovementById,
  ApiSearchInventoryMovements,
  ApiExportInventoryMovementsCsv,
} from './decorators';
import {
  MovementFiltersDto,
  MovementSearchDto,
  MovementAdvancedFiltersDto,
  MovementCsvExportDto,
  InventoryMovementExactSearchDto,
  InventoryMovementSimpleFilterDto,
} from './dto';
import { GetByIdParamDto } from '../../common/dto/operation-param.dto';
import { FilterTermQueryDto } from '../../common/dto/operation-query.dto';

@ApiTags('InventoryMovements')
@Controller('inventory_movements')
export class InventoryMovementsController {
  constructor(
    private readonly inventoryMovementCrudService: InventoryMovementCrudService,
    private readonly fileExportService: FileExportService,
    @Inject('IInventoryMovementSearchRepository')
    private readonly searchRepository: IInventoryMovementSearchRepository,
  ) {}

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetInventoryMovements()
  async getAll(@Query() pagination: PaginationInputDto, @Request() req): Promise<any> {
    return this.inventoryMovementCrudService.findAll(
      pagination,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetInventoryMovementById()
  async getById(@Param() params: GetByIdParamDto, @Request() req): Promise<any> {
    return this.inventoryMovementCrudService.findById(
      params.id,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchInventoryMovements()
  async getBySearch(
    @Body() searchDto: InventoryMovementExactSearchDto,
    @Query() pagination: PaginationInputDto,
    @Request() req,
  ): Promise<any> {
    return this.inventoryMovementCrudService.exactSearchMovements(
      searchDto,
      pagination,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchInventoryMovements()
  async getByFilterParam(
    @Query() termQuery: FilterTermQueryDto,
    @Query() pagination: PaginationInputDto,
    @Request() req,
  ): Promise<any> {
    return this.searchRepository.simpleFilterMovements(
      termQuery.term,
      pagination,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchInventoryMovements()
  async getByAdvancedFilter(
    @Body() filters: MovementAdvancedFiltersDto,
    @Query() pagination: PaginationInputDto,
    @Request() req,
  ): Promise<any> {
    return this.inventoryMovementCrudService.advancedFilterMovements(
      filters,
      pagination,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiExportInventoryMovementsCsv()
  async exportToCsv(
    @Query() exportFilters: MovementCsvExportDto,
    @Request() req,
    @Res() res: Response,
  ): Promise<any> {
    return this.inventoryMovementCrudService.exportMovementsCsv(
      exportFilters,
      res,
      req.user?.userId,
      req.user?.role?.name,
    );
  }
}
