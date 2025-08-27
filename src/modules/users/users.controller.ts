import { 
  Controller, 
  Get, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Request,
  ForbiddenException,
  Query
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiParam 
} from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from './entities/user.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get all users (Admin only)',
    description: 'Retrieve a paginated list of all users. Requires admin role.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid-string' },
              username: { type: 'string', example: 'john_doe' },
              email: { type: 'string', example: 'john@example.com' },
              role: { type: 'string', example: 'user' },
              createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
              updatedAt: { type: 'string', example: '2024-01-02T00:00:00.000Z' }
            }
          }
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 10 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin role required' })
  async findAll(@Query() pagination: PaginationDto) {
    return this.userService.findAll(pagination);
  }

  @Get(':id')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User UUID', example: 'uuid-string' })
  @ApiOperation({ 
    summary: 'Get user by ID',
    description: 'Retrieve user information. Users can only view their own profile unless they are admin.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-string' },
        username: { type: 'string', example: 'john_doe' },
        email: { type: 'string', example: 'john@example.com' },
        role: { type: 'string', example: 'user' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-02T00:00:00.000Z' }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - You can only view your own profile' })
  async findOne(@Param('id') id: string, @Request() req) {
    const currentUser = req.user;
    
    if (currentUser.role !== UserRole.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return this.userService.findById(id);
  }

  @Put(':id')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User UUID', example: 'uuid-string' })
  @ApiOperation({ 
    summary: 'Update user',
    description: 'Update user information. Users can only update their own profile unless they are admin.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-string' },
        username: { type: 'string', example: 'john_doe' },
        email: { type: 'string', example: 'john@example.com' },
        role: { type: 'string', example: 'user' },
        createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-02T00:00:00.000Z' }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - You can only update your own profile' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    const currentUser = req.user;
    
    if (currentUser.role !== UserRole.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.userService.update(id, updateUserDto, req.user.userId);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'User UUID', example: 'uuid-string' })
  @ApiOperation({ 
    summary: 'Delete user (Admin only)',
    description: 'Soft delete a user. Requires admin role.' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User deleted successfully' }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
  @ApiForbiddenResponse({ description: 'Forbidden - Admin role required' })
  async softDelete(@Param('id') id: string, @Request() req) {
    await this.userService.softDelete(id, req.user.userId);
    return { message: 'User deleted successfully' };
  }
}