import { 
  Controller, 
  Post, 
  Body, 
  UnauthorizedException, 
  Request, 
  Get 
} from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./services/auth.service";
import { LoginDto } from "./dto";
import { Public, Auth } from "../../common/decorators/auth.decorator";
import { UserRole } from "../users/enums/user-role.enum";
import { ERROR_MESSAGES } from "../../common/exceptions";
import { ApiLogin, ApiRegister, ApiGetProfile } from "./decorators";
import { RegisterUserDto } from "../users/dto/register-user.dto";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @Public()
  @ApiLogin()
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    return this.authService.login(user);
  }

  @Post("register")
  @Public()
  @ApiRegister()
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get("me")
  @Auth(UserRole.ADMIN, UserRole.USER)
  @ApiGetProfile()
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.userId);
  }
}