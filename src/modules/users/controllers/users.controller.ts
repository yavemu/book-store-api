import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  Query,
  Inject,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { IUserCrudService } from '../interfaces/user-crud.service.interface';
import { IUserSearchService } from '../interfaces/user-search.service.interface';
import {
  CreateUserDto,
  UpdateUserDto,
  UserFiltersDto,
  UserCsvExportFiltersDto,
  UserExactSearchDto,
  UserSimpleFilterDto,
} from '../dto';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { FileExportService } from '../../../common/services/file-export.service';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import {
  ApiCreateUser,
  ApiGetUsers,
  ApiGetUserById,
  ApiUpdateUser,
  ApiDeleteUser,
  ApiSearchUsers,
  ApiFilterUsers,
  ApiFilterUsersRealtime,
  ApiExportUsersCsv,
} from '../decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject('IUserCrudService')
    private readonly userCrudService: IUserCrudService,
    @Inject('IUserSearchService')
    private readonly userSearchService: IUserSearchService,
    private readonly fileExportService: FileExportService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateUser()
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.userCrudService.create(createUserDto, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetUsers()
  async findAll(@Query() pagination: PaginationDto, @Request() req) {
    return this.userCrudService.findAll(pagination, req.user?.userId, req.user?.role?.name);
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchUsers()
  async exactSearch(@Body() searchDto: UserExactSearchDto, @Request() req) {
    return this.userSearchService.exactSearch(searchDto, req.user?.userId, req.user?.role?.name);
  }

  @Post('filter')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterUsersRealtime()
  async simpleFilter(@Body() filterDto: UserSimpleFilterDto, @Request() req) {
    return this.userSearchService.simpleFilter(filterDto, req.user?.userId, req.user?.role?.name);
  }

  @Post('advanced-filter')
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterUsers()
  async advancedFilter(
    @Body() filters: UserFiltersDto,
    @Query() pagination: PaginationDto,
    @Request() req,
  ) {
    return this.userSearchService.findWithFilters(
      filters,
      pagination,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportUsersCsv()
  async exportToCsv(@Query() filters: UserCsvExportFiltersDto, @Res() res: Response) {
    const csvData = await this.userSearchService.exportToCsv(filters);
    const filename = this.fileExportService.generateDateBasedFilename('usuarios', 'csv');

    this.fileExportService.exportToCsv(res, {
      content: csvData,
      filename,
      type: 'csv',
    });
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetUserById()
  async findOne(@Param('id') id: string, @Request() req) {
    return this.userCrudService.findById(id, req.user?.userId, req.user?.role?.name);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiUpdateUser()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    return this.userCrudService.update(
      id,
      updateUserDto,
      req.user?.userId,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteUser()
  async remove(@Param('id') id: string, @Request() req) {
    return this.userCrudService.softDelete(id, req.user.userId);
  }
}
