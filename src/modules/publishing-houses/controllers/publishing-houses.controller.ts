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
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IPublishingHouseService } from '../interfaces/publishing-house.service.interface';
import { IPublishingHouseSearchService } from '../interfaces/publishing-house-search.service.interface';
import {
  CreatePublishingHouseDto,
  UpdatePublishingHouseDto,
  PublishingHouseFiltersDto,
  PublishingHouseCsvExportFiltersDto,
  PublishingHouseExactSearchDto,
  PublishingHouseSimpleFilterDto,
} from '../dto';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import {
  ApiCreatePublishingHouse,
  ApiGetPublishingHouses,
  ApiGetPublishingHouseById,
  ApiUpdatePublishingHouse,
  ApiDeletePublishingHouse,
  ApiSearchPublishingHouses,
  ApiFilterPublishingHouses,
  ApiSimpleFilterPublishingHouses,
  ApiExportPublishingHousesCsv,
  ApiListSelectPublishingHouses,
} from '../decorators';

@ApiTags('Publishing Houses')
@Controller('publishing-houses')
export class PublishingHousesController {
  constructor(
    @Inject('IPublishingHouseService')
    private readonly publishingHouseService: IPublishingHouseService,
    @Inject('IPublishingHouseSearchService')
    private readonly publishingHouseSearchService: IPublishingHouseSearchService,
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
  findAll(@Query() pagination: PaginationInputDto) {
    return this.publishingHouseService.findAll(pagination);
  }

  @Get('list-select')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiListSelectPublishingHouses()
  findForSelect() {
    return this.publishingHouseService.findForSelect();
  }

  @Post('search')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchPublishingHouses()
  exactSearch(
    @Body() searchDto: PublishingHouseExactSearchDto,
    @Query() pagination: PaginationInputDto,
  ) {
    const paginationDto: PaginationDto = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      sortBy: pagination.sortBy || 'createdAt',
      sortOrder: pagination.sortOrder || 'DESC',
      offset: pagination.offset,
    };
    return this.publishingHouseSearchService.exactSearch(searchDto, paginationDto);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSimpleFilterPublishingHouses()
  simpleFilter(@Query() filterDto: PublishingHouseSimpleFilterDto) {
    const pagination = new PaginationDto();
    pagination.page = filterDto.page;
    pagination.limit = filterDto.limit;
    pagination.sortBy = filterDto.sortBy;
    pagination.sortOrder = filterDto.sortOrder;
    return this.publishingHouseSearchService.simpleFilter(filterDto.term, pagination);
  }

  @Post('advanced-filter')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterPublishingHouses()
  advancedFilter(
    @Body() filters: PublishingHouseFiltersDto,
    @Query() pagination: PaginationInputDto,
  ) {
    return this.publishingHouseSearchService.findWithFilters(filters, pagination);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportPublishingHousesCsv()
  async exportToCsv(@Query() filters: PublishingHouseCsvExportFiltersDto, @Res() res: Response) {
    const csvData = await this.publishingHouseSearchService.exportToCsv(filters);
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

  // Legacy method names for backward compatibility with tests
  async search(searchTerm: any, pagination: PaginationInputDto) {
    return this.exactSearch(searchTerm, pagination);
  }

  async filter(filters: any, pagination: PaginationInputDto) {
    const filterDto = new PublishingHouseSimpleFilterDto();
    filterDto.term = filters.term || '';
    filterDto.page = pagination.page;
    filterDto.limit = pagination.limit;
    filterDto.sortBy = pagination.sortBy;
    filterDto.sortOrder = pagination.sortOrder;
    return this.simpleFilter(filterDto);
  }
}
