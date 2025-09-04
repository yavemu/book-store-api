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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Request as ExpressRequest } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
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
  UserDataDto,
  UsersListDataDto,
} from '../dto';
import { StandardResponseDto } from '../../../common/dto/paginated-response.dto';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import { FileExportService } from '../../../common/services/file-export.service';
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
    private readonly userService: UserService,
    private readonly fileExportService: FileExportService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateUser()
  async create(
    @Body() requestDto: CreateUserRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<UserDataDto>> {
    return this.userService.createUser(requestDto, req);
  }

  @Get()
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetUsers()
  async findAll(
    @Query() requestDto: GetAllUsersDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<UsersListDataDto>> {
    return this.userService.findAllUsers(requestDto, req);
  }

  @Post('search')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiSearchUsers()
  async searchUsers(
    @Body() requestDto: GetUsersBySearchDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<UsersListDataDto>> {
    return this.userService.searchUsers(requestDto, req);
  }

  @Get('filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterUsersRealtime()
  async filterUsers(
    @Query() requestDto: GetUsersByFilterDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<UsersListDataDto>> {
    return this.userService.filterUsers(requestDto, req);
  }

  @Post('advanced-filter')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiFilterUsers()
  async findUsers(
    @Body() requestDto: GetUsersByAdvancedFilterDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<UsersListDataDto>> {
    return this.userService.findUsers(requestDto, req);
  }

  @Get('export/csv')
  @Auth(UserRole.ADMIN)
  @ApiExportUsersCsv()
  async exportUsersCsv(
    @Query() requestDto: ExportUsersCsvRequestDto,
    @Res() res: Response,
    @Request() req: ExpressRequest,
  ): Promise<void> {
    const csvData = await this.userService.exportUsersCsv(requestDto, req);
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csvData);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetUserById()
  async findOne(
    @Param() requestDto: GetUserByIdDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<UserDataDto>> {
    return this.userService.findUserById(requestDto, req);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiUpdateUser()
  async update(
    @Body() requestDto: UpdateUserRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<UserDataDto>> {
    return this.userService.updateUser(requestDto, req);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteUser()
  async remove(
    @Param() requestDto: DeleteUserRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<{ id: string }>> {
    return this.userService.deleteUser(requestDto, req);
  }
}
