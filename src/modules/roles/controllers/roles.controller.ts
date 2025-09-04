import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { RoleService } from '../services/role.service';
import {
  CreateRoleRequestDto,
  GetAllRolesDto,
  GetRoleByIdDto,
  UpdateRoleRequestDto,
  DeleteRoleRequestDto,
  SearchRolesRequestDto,
  RoleDataDto,
  RolesListDataDto,
} from '../dto';
import { StandardResponseDto } from '../../../common/dto/paginated-response.dto';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';
import {
  ApiCreateRole,
  ApiGetRoles,
  ApiGetRoleById,
  ApiUpdateRole,
  ApiDeleteRole,
  ApiSearchRoles,
} from '../decorators';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiCreateRole()
  async create(
    @Body() requestDto: CreateRoleRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<RoleDataDto>> {
    return this.roleService.createRole(requestDto, req);
  }

  @Get()
  @Auth(UserRole.ADMIN)
  @ApiGetRoles()
  async findAll(
    @Query() requestDto: GetAllRolesDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<RolesListDataDto>> {
    return this.roleService.findAllRoles(requestDto, req);
  }

  @Post('search')
  @Auth(UserRole.ADMIN)
  @ApiSearchRoles()
  async searchRoles(
    @Body() requestDto: SearchRolesRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<RolesListDataDto>> {
    return this.roleService.searchRoles(requestDto, req);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  @ApiGetRoleById()
  async findOne(
    @Param() requestDto: GetRoleByIdDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<RoleDataDto>> {
    return this.roleService.findRoleById(requestDto, req);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiUpdateRole()
  async update(
    @Body() requestDto: UpdateRoleRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<RoleDataDto>> {
    return this.roleService.updateRole(requestDto, req);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiDeleteRole()
  async remove(
    @Param() requestDto: DeleteRoleRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<{ id: string }>> {
    return this.roleService.deleteRole(requestDto, req);
  }
}
