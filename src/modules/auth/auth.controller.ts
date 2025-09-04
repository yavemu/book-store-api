import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './services/auth.service';
import {
  LoginRequestDto,
  RegisterRequestDto,
  LoginDataDto,
  RegisterDataDto,
  UserProfileDataDto,
} from './dto';
import { StandardResponseDto } from '../../common/dto/paginated-response.dto';
import { Public, Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ApiLogin, ApiRegister, ApiGetProfile } from './decorators';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiLogin()
  async login(
    @Body() requestDto: LoginRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<LoginDataDto>> {
    return this.authService.loginUser(requestDto, req);
  }

  @Post('register')
  @Public()
  @ApiRegister()
  async register(
    @Body() requestDto: RegisterRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<RegisterDataDto>> {
    return this.authService.registerUser(requestDto, req);
  }

  @Get('me')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetProfile()
  async getProfile(
    @Request() req: ExpressRequest,
  ): Promise<StandardResponseDto<UserProfileDataDto>> {
    return this.authService.getUserProfile(req);
  }
}
