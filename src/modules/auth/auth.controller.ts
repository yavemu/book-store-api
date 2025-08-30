import { Controller, Post, Body, UnauthorizedException, Request, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto';
import { Public, Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../users/enums/user-role.enum';
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
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const user = await this.authService.validateUser(loginDto.email, loginDto.password, ipAddress);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    return this.authService.login(user);
  }

  @Post('register')
  @Public()
  @ApiRegister()
  async register(@Body() registerUserDto: RegisterUserDto, @Request() req) {
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    return this.authService.register(registerUserDto, ipAddress);
  }

  @Get('me')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetProfile()
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}
