import { Controller, Get, Param, Query, Request, Post, Body, Res, HttpCode, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { InventoryMovementCrudService } from './services/inventory-movement-crud.service';
import { IInventoryMovementSearchRepository } from './interfaces/inventory-movement-search.repository.interface';
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
  async getAllInventoryMovements(@Query() pagination: PaginationInputDto, @Request() req) {
    return {
      data: await this.inventoryMovementCrudService.findAll(
        pagination,
        req.user?.userId,
        req.user?.role?.name,
      ),
      message: SUCCESS_MESSAGES.INVENTORY_MOVEMENTS.FOUND_ALL,
    };
  }

  @Post('search')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchInventoryMovements()
  async exactSearch(@Body() searchDto: InventoryMovementExactSearchDto, @Query() pagination: PaginationInputDto, @Request() req) {
    return {
      data: await this.inventoryMovementCrudService.exactSearchMovements(
        searchDto,
        req.user?.userId,
        req.user?.role?.name,
      ),
      message: SUCCESS_MESSAGES.GENERAL.SEARCH_SUCCESS,
    };
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchInventoryMovements()
  async simpleFilter(@Query() filterDto: InventoryMovementSimpleFilterDto, @Request() req) {
    // Validar que el término sea obligatorio
    if (!filterDto.term || filterDto.term.trim().length === 0) {
      throw new HttpException('Filter term is required', HttpStatus.BAD_REQUEST);
    }
    
    return {
      data: await this.searchRepository.simpleFilterMovements(
        filterDto,
        req.user?.userId,
        req.user?.role?.name,
      ),
      message: SUCCESS_MESSAGES.GENERAL.SEARCH_SUCCESS,
    };
  }

  @Post('advanced-filter')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchInventoryMovements()
  async advancedFilter(
    @Body() filters: MovementAdvancedFiltersDto,
    @Query() pagination: PaginationInputDto,
    @Request() req,
  ) {
    return {
      data: await this.inventoryMovementCrudService.advancedFilterMovements(
        filters,
        pagination,
        req.user?.userId,
        req.user?.role?.name,
      ),
      message: SUCCESS_MESSAGES.GENERAL.SEARCH_SUCCESS,
    };
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetInventoryMovementById()
  async getInventoryMovementById(@Param('id') id: string, @Request() req) {
    return {
      data: await this.inventoryMovementCrudService.findById(
        id,
        req.user?.userId,
        req.user?.role?.name,
      ),
      message: SUCCESS_MESSAGES.INVENTORY_MOVEMENTS.FOUND_ONE,
    };
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiExportInventoryMovementsCsv()
  async exportMovementsCsv(
    @Query() exportFilters: MovementCsvExportDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const csvData = await this.inventoryMovementCrudService.exportMovementsCsv(
      exportFilters.filters,
      exportFilters.search,
      exportFilters.advancedFilters,
      req.user?.userId,
      req.user?.role?.name,
    );

    const filename = this.fileExportService.generateDateBasedFilename(
      'movimientos-inventario',
      'csv',
    );

    this.fileExportService.exportToCsv(res, {
      content: csvData,
      filename,
      type: 'csv',
    });
  }
}
