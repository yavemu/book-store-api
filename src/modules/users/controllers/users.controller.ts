import { Controller, Get, Post, Put, Delete, Param, Body, Request, ForbiddenException, Query, Inject } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IUserCrudService } from '../interfaces/user-crud.service.interface';
import { CreateUserDto, UpdateUserDto } from "../dto";
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from "../enums/user-role.enum";
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ApiCreateUser, ApiGetUsers, ApiGetUserById, ApiUpdateUser, ApiDeleteUser } from "../decorators";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(
    @Inject('IUserCrudService')
    private readonly userCrudService: IUserCrudService
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

  @Get(":id")
  @Auth(UserRole.ADMIN)
  @ApiGetUserById()
  async findOne(@Param("id") id: string, @Request() req) {
    const currentUser = req.user;

    if (currentUser.role !== UserRole.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException("You can only view your own profile");
    }

    return this.userCrudService.findById(id);
  }

  @Put(":id")
  @Auth(UserRole.ADMIN)
  @ApiUpdateUser()
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const currentUser = req.user;

    if (currentUser.role !== UserRole.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException("You can only update your own profile");
    }

    return this.userCrudService.update(id, updateUserDto, req.user.userId);
  }

  @Delete(":id")
  @Auth(UserRole.ADMIN)
  @ApiDeleteUser()
  async remove(@Param("id") id: string, @Request() req) {
    return this.userCrudService.softDelete(id, req.user.userId);
  }
}