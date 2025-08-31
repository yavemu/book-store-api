import { Controller, Post, Body, UnauthorizedException, Request, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto';
import { Public, Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ERROR_MESSAGES } from '../../common/constants';
import { ApiLogin, ApiRegister, ApiGetProfile } from './decorators';
import { RegisterUserDto } from '../users/dto/register-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiLogin()
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(
      loginDto.email,
      loginDto.password,
      req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'],
    );
  }

  @Post('register')
  @Public()
  @ApiRegister()
  async register(@Body() registerUserDto: RegisterUserDto, @Request() req) {
    return this.authService.register(
      registerUserDto,
      req.ip || req.connection?.remoteAddress || req.headers['x-forwarded-for'],
    );
  }

  @Get('me')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetProfile()
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}
