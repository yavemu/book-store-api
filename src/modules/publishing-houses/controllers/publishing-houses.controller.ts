import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Inject,
  Request,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IPublishingHouseService } from '../interfaces/publishing-house.service.interface';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import { PublishingHouseFiltersDto, PublishingHouseCsvExportFiltersDto } from '../dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../users/enums/user-role.enum';
import {
  ApiCreatePublishingHouse,
  ApiGetPublishingHouses,
  ApiGetPublishingHouseById,
  ApiUpdatePublishingHouse,
  ApiDeletePublishingHouse,
  ApiSearchPublishingHouses,
  ApiFilterPublishingHouses,
  ApiExportPublishingHousesCsv,
} from '../decorators';

@ApiTags('Publishing Houses')
@Controller('publishing-houses')
export class PublishingHousesController {
  constructor(
    @Inject('IPublishingHouseService')
    private readonly publishingHouseService: IPublishingHouseService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreatePublishingHouse()
  create(@Body() createPublishingHouseDto: CreatePublishingHouseDto, @Request() req: any) {
    return this.publishingHouseService.create(createPublishingHouseDto, req.user.id);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetPublishingHouses()
  findAll(@Query() pagination: PaginationDto) {
    return this.publishingHouseService.findAll(pagination);
  }

  @Get('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchPublishingHouses()
  search(@Query('term') searchTerm: string, @Query() pagination: PaginationDto) {
    return this.publishingHouseService.search(searchTerm, pagination);
  }

  @Post('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterPublishingHouses()
  async filter(@Body() filters: PublishingHouseFiltersDto, @Query() pagination: PaginationDto) {
    return this.publishingHouseService.findWithFilters(filters, pagination);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportPublishingHousesCsv()
  async exportToCsv(@Query() filters: PublishingHouseCsvExportFiltersDto, @Res() res: Response) {
    const csvData = await this.publishingHouseService.exportToCsv(filters);
    const filename = `publishing_houses_${new Date().toISOString().split('T')[0]}.csv`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvData);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetPublishingHouseById()
  findOne(@Param('id') id: string) {
    return this.publishingHouseService.findById(id);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdatePublishingHouse()
  update(
    @Param('id') id: string,
    @Body() updatePublishingHouseDto: UpdatePublishingHouseDto,
    @Request() req: any,
  ) {
    return this.publishingHouseService.update(id, updatePublishingHouseDto, req.user.id);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeletePublishingHouse()
  remove(@Param('id') id: string, @Request() req: any) {
    return this.publishingHouseService.softDelete(id, req.user.id);
  }
}
