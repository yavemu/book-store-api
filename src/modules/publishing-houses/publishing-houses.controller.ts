import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPublishingHouseService } from './interfaces/publishing-house.service.interface';
import { CreatePublishingHouseDto } from './dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from './dto/update-publishing-house.dto';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { PublishingHouse } from './entities/publishing-house.entity';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import {
  ApiCreatePublishingHouse,
  ApiGetPublishingHouses,
  ApiGetPublishingHouseById,
  ApiUpdatePublishingHouse,
  ApiDeletePublishingHouse,
  ApiSearchPublishingHouses,
  ApiGetPublishingHousesByCountry
} from './decorators';

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
  create(
    @Body() createPublishingHouseDto: CreatePublishingHouseDto,
    @Request() req: any,
  ) {
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
  search(
    @Query('term') searchTerm: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.publishingHouseService.search(searchTerm, pagination);
  }

  @Get('by-country/:country')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetPublishingHousesByCountry()
  findByCountry(
    @Param('country') country: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.publishingHouseService.findByCountry(country, pagination);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetPublishingHouseById()
  findOne(@Param('id') id: string) {
    return this.publishingHouseService.findById(id);
  }

  @Patch(':id')
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