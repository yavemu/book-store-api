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
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { IUserCrudService } from '../interfaces';
import { IUserSearchService } from '../interfaces';
import {
  CreateUserRequestDto,
  GetAllUsersDto,
  GetUserByIdDto,
  GetUsersBySearchDto,
  GetUsersByFilterDto,
  GetUsersByAdvancedFilterDto,
  UpdateUserRequestDto,
  DeleteUserRequestDto,
  ExportUsersCsvRequestDto,
} from '../dto';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { FileExportService } from '../../../common/services/file-export.service';
import {
  PromiseCreateUserResponse,
  PromiseGetAllUsersResponse,
  PromiseGetUserByIdResponse,
  PromiseGetUsersBySearchResponse,
  PromiseGetUsersByFilterResponse,
  PromiseGetUsersByAdvancedFilterResponse,
  PromiseUpdateUserResponse,
  PromiseDeleteUserResponse,
  PromiseExportUsersCsvResponse,
} from '../types/users-response.types';
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
  async create(
    @Body() requestDto: CreateUserRequestDto,
    @Request() req,
  ): PromiseCreateUserResponse {
    return this.userCrudService.create(requestDto.userData, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetUsers()
  async getAll(@Query() requestDto: GetAllUsersDto, @Request() req): PromiseGetAllUsersResponse {
    return this.userCrudService.findAll(
      requestDto.pagination,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchUsers()
  async getBySearch(
    @Body() requestDto: GetUsersBySearchDto,
    @Request() req,
  ): PromiseGetUsersBySearchResponse {
    return this.userSearchService.exactSearch(
      requestDto.searchData,
      requestDto.pagination,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterUsersRealtime()
  async getByFilterParam(
    @Query() requestDto: GetUsersByFilterDto,
    @Request() req,
  ): PromiseGetUsersByFilterResponse {
    return this.userSearchService.simpleFilter(
      requestDto.term,
      requestDto.pagination,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterUsers()
  async getByAdvancedFilter(
    @Body() requestDto: GetUsersByAdvancedFilterDto,
    @Request() req,
  ): PromiseGetUsersByAdvancedFilterResponse {
    return this.userSearchService.findWithFilters(
      requestDto.filters,
      requestDto.pagination,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportUsersCsv()
  async exportToCsv(
    @Query() requestDto: ExportUsersCsvRequestDto,
    @Res() res: Response,
    @Request() req,
  ): PromiseExportUsersCsvResponse {
    const csvData = await this.userSearchService.exportToCsv(requestDto.filters);
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csvData);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetUserById()
  async getById(@Param() requestDto: GetUserByIdDto, @Request() req): PromiseGetUserByIdResponse {
    return this.userCrudService.findById(requestDto.id, req.user?.userId, req.user?.role?.name);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiUpdateUser()
  async update(
    @Body() requestDto: UpdateUserRequestDto,
    @Request() req,
  ): PromiseUpdateUserResponse {
    return this.userCrudService.update(
      requestDto.id,
      requestDto.updateData,
      req.user?.userId,
      req.user?.userId,
      req.user?.role?.name,
    );
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteUser()
  async remove(
    @Param() requestDto: DeleteUserRequestDto,
    @Request() req,
  ): PromiseDeleteUserResponse {
    return this.userCrudService.softDelete(requestDto.id, req.user.userId);
  }
}
