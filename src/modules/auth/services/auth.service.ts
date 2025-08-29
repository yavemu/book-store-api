import { Injectable, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { IUserCrudService } from "../../users/interfaces/user-crud.service.interface";
import { IUserSearchService } from "../../users/interfaces/user-search.service.interface";
import { IUserAuthService } from "../../users/interfaces/user-auth.service.interface";
import { User } from "../../users/entities/user.entity";
import { RegisterUserDto } from "../../users/dto/register-user.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserCrudService')
    private readonly userCrudService: IUserCrudService,
    @Inject('IUserSearchService')
    private readonly userSearchService: IUserSearchService,
    @Inject('IUserAuthService')
    private readonly userAuthService: IUserAuthService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userSearchService.findToLoginByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: User) {
    // Log the login event for auditing
    await this.userAuthService.logLogin(user.id);

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const user = await this.userCrudService.register(registerUserDto);
    return {
      message: "Usuario creado exitosamente",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userCrudService.findById(userId);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
