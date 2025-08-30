import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  ForbiddenException,
  Query,
  Inject,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { IUserCrudService } from '../interfaces/user-crud.service.interface';
import { IUserSearchService } from '../interfaces/user-search.service.interface';
import { CreateUserDto, UpdateUserDto, UserFiltersDto, UserCsvExportFiltersDto } from '../dto';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../enums/user-role.enum';
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
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateUser()
  async create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.userCrudService.create(createUserDto, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN)
  @ApiGetUsers()
  async findAll(@Query() pagination: PaginationDto) {
    return this.userCrudService.findAll(pagination);
  }

  @Get('search')
  @Auth(UserRole.ADMIN)
  @ApiSearchUsers()
  async search(@Query('term') searchTerm: string, @Query() pagination: PaginationDto) {
    return this.userSearchService.search(searchTerm, pagination);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN)
  @ApiFilterUsersRealtime()
  async filter(@Query('filter') filterTerm: string, @Query() pagination: PaginationDto) {
    return this.userSearchService.filterSearch(filterTerm, pagination);
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN)
  @ApiFilterUsers()
  async advancedFilter(@Body() filters: UserFiltersDto, @Query() pagination: PaginationDto) {
    return this.userSearchService.findWithFilters(filters, pagination);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportUsersCsv()
  async exportToCsv(@Query() filters: UserCsvExportFiltersDto, @Res() res: Response) {
    const csvData = await this.userSearchService.exportToCsv(filters);

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `usuarios-${currentDate}.csv`;

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Add BOM for UTF-8 to ensure proper encoding in Excel
    const csvWithBom = '\uFEFF' + csvData;

    return res.send(csvWithBom);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  @ApiGetUserById()
  async findOne(@Param('id') id: string, @Request() req) {
    const currentUser = req.user;

    if (currentUser.role !== UserRole.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return this.userCrudService.findById(id);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateUser()
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const currentUser = req.user;

    if (currentUser.role !== UserRole.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.userCrudService.update(id, updateUserDto, req.user.userId);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteUser()
  async remove(@Param('id') id: string, @Request() req) {
    return this.userCrudService.softDelete(id, req.user.userId);
  }
}
