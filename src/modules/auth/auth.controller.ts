import { Controller, Post, Body, UnauthorizedException, Request, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './services/auth.service';
import { LoginRequestDto, RegisterRequestDto } from './dto';
import { Public, Auth } from '../../common/decorators/auth.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ERROR_MESSAGES } from '../../common/constants';
import { ApiLogin, ApiRegister, ApiGetProfile } from './decorators';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiLogin()
  async login(@Body() requestDto: LoginRequestDto, @Request() req): Promise<any> {
    return this.authService.login(
      requestDto.loginData.email,
      requestDto.loginData.password,
      req.ip,
    );
  }

  @Post('register')
  @Public()
  @ApiRegister()
  async register(@Body() requestDto: RegisterRequestDto, @Request() req): Promise<any> {
    return this.authService.register(requestDto.registrationData, req.ip);
  }

  @Get('me')
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetProfile()
  async getProfile(@Request() req): Promise<any> {
    return this.authService.getProfile(req.user.userId);
  }
}
