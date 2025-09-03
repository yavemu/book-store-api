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
import { IPublishingHouseService } from '../interfaces';
import { IPublishingHouseSearchService } from '../interfaces';
import {
  CreatePublishingHouseDto,
  UpdatePublishingHouseDto,
  PublishingHouseFiltersDto,
  PublishingHouseCsvExportFiltersDto,
  PublishingHouseExactSearchDto,
  PublishingHouseSimpleFilterDto,
} from '../dto';
import {
  GetByIdParamDto,
  UpdateByIdParamDto,
  SoftDeleteParamDto,
} from '../../../common/dto/operation-param.dto';
import { FilterTermQueryDto } from '../../../common/dto/operation-query.dto';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';
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
  async create(
    @Body() createPublishingHouseDto: CreatePublishingHouseDto,
    @Request() req: any,
  ): Promise<any> {
    return this.publishingHouseService.create(createPublishingHouseDto, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetPublishingHouses()
  async getAll(@Query() pagination: PaginationInputDto, @Request() req: any): Promise<any> {
    return this.publishingHouseService.findAll(pagination, req.user.userId);
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchPublishingHouses()
  async getBySearch(
    @Body() searchDto: PublishingHouseExactSearchDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.publishingHouseSearchService.exactSearch(searchDto, pagination, req.user.userId);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSimpleFilterPublishingHouses()
  async getByFilterParam(
    @Query() termQuery: FilterTermQueryDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.publishingHouseSearchService.simpleFilter(
      termQuery.term,
      pagination,
      req.user.userId,
    );
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterPublishingHouses()
  async getByAdvancedFilter(
    @Body() filters: PublishingHouseFiltersDto,
    @Query() pagination: PaginationInputDto,
    @Request() req: any,
  ): Promise<any> {
    return this.publishingHouseSearchService.findWithFilters(filters, pagination, req.user.userId);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportPublishingHousesCsv()
  async exportToCsv(
    @Query() filters: PublishingHouseCsvExportFiltersDto,
    @Res() res: Response,
    @Request() req: any,
  ): Promise<any> {
    return this.publishingHouseSearchService.exportToCsv(filters, res, req.user.userId);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetPublishingHouseById()
  async getById(@Param() params: GetByIdParamDto, @Request() req: any): Promise<any> {
    return this.publishingHouseService.findById(params.id, req.user.userId);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdatePublishingHouse()
  async update(
    @Param() params: UpdateByIdParamDto,
    @Body() updatePublishingHouseDto: UpdatePublishingHouseDto,
    @Request() req: any,
  ): Promise<any> {
    return this.publishingHouseService.update(params.id, updatePublishingHouseDto, req.user.userId);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeletePublishingHouse()
  async remove(@Param() params: SoftDeleteParamDto, @Request() req: any): Promise<any> {
    return this.publishingHouseService.softDelete(params.id, req.user.userId);
  }
}
