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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IRoleCrudService } from '../interfaces';
import { IRoleSearchService } from '../interfaces';
import { IUserContextService } from '../interfaces';
import {
  CreateRoleRequestDto,
  UpdateRoleRequestDto,
  GetAllRolesDto,
  SearchRolesRequestDto,
  RoleResponseDto,
} from '../dto';
import {
  GetByIdParamDto,
  UpdateByIdParamDto,
  SoftDeleteParamDto,
  GetByNameParamDto,
  GetByPermissionParamDto,
} from '../../../common/dto/operation-param.dto';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../../common/enums/user-role.enum';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(
    @Inject('IRoleCrudService')
    private readonly crudService: IRoleCrudService,
    @Inject('IRoleSearchService')
    private readonly searchService: IRoleSearchService,
    @Inject('IUserContextService')
    private readonly userContextService: IUserContextService,
  ) {}

  @Post()
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully', type: RoleResponseDto })
  @ApiResponse({ status: 409, description: 'Role name already exists' })
  async create(@Body() requestDto: CreateRoleRequestDto, @Request() req: any): Promise<any> {
    return this.crudService.create(requestDto.roleData, req.user.userId);
  }

  @Get()
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all roles with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Roles retrieved successfully',
    type: [RoleResponseDto],
  })
  async getAll(@Query() requestDto: GetAllRolesDto, @Request() req: any): Promise<any> {
    return this.crudService.findAll(requestDto.pagination, req.user.userId);
  }

  @Get('active')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all active roles with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Active roles retrieved successfully',
    type: [RoleResponseDto],
  })
  async getActiveRoles(@Query() requestDto: GetAllRolesDto, @Request() req: any): Promise<any> {
    return this.searchService.findActiveRoles(requestDto.pagination, req.user.userId);
  }

  @Post('search')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Buscar roles - Acceso: ADMIN' })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda de roles obtenidos exitosamente',
    type: [RoleResponseDto],
  })
  async getBySearch(@Body() requestDto: SearchRolesRequestDto, @Request() req: any): Promise<any> {
    return this.searchService.searchRoles(
      requestDto.searchCriteria,
      requestDto.pagination,
      req.user.userId,
    );
  }

  @Get('by-permission/:permission')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Find roles by permission' })
  @ApiResponse({
    status: 200,
    description: 'Roles with permission retrieved successfully',
    type: [RoleResponseDto],
  })
  async getByPermission(
    @Param() params: GetByPermissionParamDto,
    @Query() requestDto: GetAllRolesDto,
    @Request() req: any,
  ): Promise<any> {
    return this.searchService.findRolesByPermission(
      params.permission,
      requestDto.pagination,
      req.user.userId,
    );
  }

  @Get('by-name/:name')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Find role by name' })
  @ApiResponse({ status: 200, description: 'Role found successfully', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getByName(@Param() params: GetByNameParamDto, @Request() req: any): Promise<any> {
    return this.searchService.findByName(params.name, req.user.userId);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getById(@Param() params: GetByIdParamDto, @Request() req: any): Promise<any> {
    return this.crudService.findOne(params.id, req.user.userId);
  }

  @Put(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update role by ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 409, description: 'Role name already exists' })
  async update(@Body() requestDto: UpdateRoleRequestDto, @Request() req: any): Promise<any> {
    return this.crudService.update(requestDto.id, requestDto.updateData, req.user.userId);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete role by ID (soft delete)' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async remove(@Param() params: SoftDeleteParamDto, @Request() req: any): Promise<any> {
    return this.crudService.remove(params.id, req.user.userId);
  }
}
