import { Controller, Get, Param, Query, Request, Post, Body, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { InventoryMovementCrudService } from './services/inventory-movement-crud.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
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
} from './dto';

@ApiTags('InventoryMovements')
@Controller('inventory_movements')
export class InventoryMovementsController {
  constructor(
    private readonly inventoryMovementCrudService: InventoryMovementCrudService,
    private readonly fileExportService: FileExportService,
  ) {}

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetInventoryMovements()
  async getAllInventoryMovements(@Query() pagination: PaginationDto, @Request() req) {
    return {
      data: await this.inventoryMovementCrudService.findAll(pagination, req.user?.userId, req.user?.role?.name),
      message: SUCCESS_MESSAGES.INVENTORY_MOVEMENTS.FOUND_ALL,
    };
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetInventoryMovementById()
  async getInventoryMovementById(@Param('id') id: string, @Request() req) {
    return {
      data: await this.inventoryMovementCrudService.findById(id, req.user?.userId, req.user?.role?.name),
      message: SUCCESS_MESSAGES.INVENTORY_MOVEMENTS.FOUND_ONE,
    };
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchInventoryMovements()
  async searchInventoryMovements(
    @Body()
    searchBody: {
      pagination: PaginationDto;
      filters?: MovementFiltersDto;
      search?: MovementSearchDto;
      advancedFilters?: MovementAdvancedFiltersDto;
    },
    @Request() req,
  ) {
    return {
      data: await this.inventoryMovementCrudService.searchMovements(
        searchBody.pagination,
        searchBody.filters,
        searchBody.search,
        searchBody.advancedFilters,
        req.user?.userId,
        req.user?.role?.name,
      ),
      message: SUCCESS_MESSAGES.GENERAL.SEARCH_SUCCESS,
    };
  }

  @Post('export/csv')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiExportInventoryMovementsCsv()
  async exportMovementsCsv(
    @Body() exportBody: MovementCsvExportDto,
    @Request() req,
    @Res() res: Response,
  ) {
    const csvData = await this.inventoryMovementCrudService.exportMovementsCsv(
      exportBody.filters,
      exportBody.search,
      exportBody.advancedFilters,
      req.user?.userId,
      req.user?.role?.name,
    );

    const filename = this.fileExportService.generateDateBasedFilename('movimientos-inventario', 'csv');

    this.fileExportService.exportToCsv(res, {
      content: csvData,
      filename,
      type: 'csv',
    });
  }
}
