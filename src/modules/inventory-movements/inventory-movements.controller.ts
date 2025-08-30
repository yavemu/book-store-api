import { Controller, Get, Param, Query, Request, Post, Body, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { InventoryMovementCrudService } from './services/inventory-movement-crud.service';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
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
  constructor(private readonly inventoryMovementCrudService: InventoryMovementCrudService) {}

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER) // Gestores de inventario también tienen UserRole.USER con permisos específicos
  @ApiGetInventoryMovements()
  async getAllInventoryMovements(@Query() pagination: PaginationDto) {
    return {
      data: await this.inventoryMovementCrudService.findAll(pagination),
      message: 'Movimientos de inventario obtenidos exitosamente',
    };
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetInventoryMovementById()
  async getInventoryMovementById(@Param('id') id: string) {
    return {
      data: await this.inventoryMovementCrudService.findById(id),
      message: 'Movimiento de inventario obtenido exitosamente',
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
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    return {
      data: await this.inventoryMovementCrudService.searchMovements(
        searchBody.pagination,
        searchBody.filters,
        searchBody.search,
        searchBody.advancedFilters,
        userId,
        userRole,
      ),
      message: 'Búsqueda de movimientos de inventario completada exitosamente',
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
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const csvContent = await this.inventoryMovementCrudService.exportMovementsCsv(
      exportBody.filters,
      exportBody.search,
      exportBody.advancedFilters,
      userId,
      userRole,
    );

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="movimientos-inventario.csv"');
    res.send(csvContent);
  }
}
