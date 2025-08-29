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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IRoleCrudService } from '../interfaces/role-crud.service.interface';
import { IRoleSearchService } from '../interfaces/role-search.service.interface';
import { IUserContextService } from '../interfaces/user-context.service.interface';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleResponseDto } from '../dto/role-response.dto';
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { Auth } from '../../../common/decorators/auth.decorator';
import { UserRole } from '../../users/enums/user-role.enum';

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
  create(
    @Body() createRoleDto: CreateRoleDto,
    @Request() req: any,
  ) {
    const userId = this.userContextService.extractUserId(req);
    return this.crudService.create(createRoleDto, userId);
  }

  @Get()
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all roles with pagination' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully', type: [RoleResponseDto] })
  findAll(@Query() pagination: PaginationDto) {
    return this.crudService.findAll(pagination);
  }

  @Get('active')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all active roles with pagination' })
  @ApiResponse({ status: 200, description: 'Active roles retrieved successfully', type: [RoleResponseDto] })
  findActiveRoles(@Query() pagination: PaginationDto) {
    return this.searchService.findActiveRoles(pagination);
  }

  @Get('search')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Search roles by term' })
  @ApiResponse({ status: 200, description: 'Roles found successfully', type: [RoleResponseDto] })
  searchRoles(
    @Query('term') term: string,
    @Query() pagination: PaginationDto
  ) {
    return this.searchService.searchRoles(term, pagination);
  }

  @Get('by-permission/:permission')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Find roles by permission' })
  @ApiResponse({ status: 200, description: 'Roles with permission retrieved successfully', type: [RoleResponseDto] })
  findRolesByPermission(
    @Param('permission') permission: string,
    @Query() pagination: PaginationDto
  ) {
    return this.searchService.findRolesByPermission(permission, pagination);
  }

  @Get('by-name/:name')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Find role by name' })
  @ApiResponse({ status: 200, description: 'Role found successfully', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findByName(@Param('name') name: string) {
    return this.searchService.findByName(name);
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id') id: string) {
    return this.crudService.findOne(id);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update role by ID' })
  @ApiResponse({ status: 200, description: 'Role updated successfully', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 409, description: 'Role name already exists' })
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: any,
  ) {
    const userId = this.userContextService.extractUserId(req);
    return this.crudService.update(id, updateRoleDto, userId);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete role by ID (soft delete)' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = this.userContextService.extractUserId(req);
    return this.crudService.remove(id, userId);
  }
}