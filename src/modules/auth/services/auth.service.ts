import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request as ExpressRequest } from 'express';
import { UserService } from '../../users/services/user.service';
import { User } from '../../users/entities/user.entity';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../common/constants';
import { LoginRequestDto, RegisterRequestDto } from '../dto';
import {
  ILoginRequest,
  IRegisterRequest,
  ILoginResponse,
  IRegisterResponse,
  IUserProfileResponse,
} from '../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string, ipAddress?: string): Promise<User | null> {
    try {
      const user = await this.userService.findToLoginByEmail(email);

      if (!user) {
        // Usuario no encontrado - audit log será manejado por interceptores
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        // Contraseña incorrecta - audit log será manejado por interceptores
        return null;
      }

      return user;
    } catch (error) {
      // Error del sistema durante validación - audit log será manejado por interceptores
      throw error;
    }
  }

  async loginUser(requestDto: LoginRequestDto, req: ExpressRequest): Promise<ILoginResponse> {
    // Convert DTO to internal interface
    const loginRequest: ILoginRequest = {
      loginData: {
        email: requestDto.loginData.email,
        password: requestDto.loginData.password,
      },
    };

    const ipAddress = req.ip || req.connection?.remoteAddress;
    const user = await this.validateUser(
      loginRequest.loginData.email,
      loginRequest.loginData.password,
      ipAddress,
    );

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // Login success - audit log será manejado por interceptores

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role.name,
    };

    return {
      data: {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role.name,
        },
      },
      message: SUCCESS_MESSAGES.AUTH.LOGIN_SUCCESS,
    };
  }

  async registerUser(
    requestDto: RegisterRequestDto,
    req: ExpressRequest,
  ): Promise<IRegisterResponse> {
    try {
      // Convert DTO to internal interface
      const registerRequest: IRegisterRequest = {
        registrationData: {
          username: requestDto.registrationData.username,
          email: requestDto.registrationData.email,
          password: requestDto.registrationData.password,
          confirmPassword: requestDto.registrationData.confirmPassword,
          roleId: requestDto.registrationData.roleId,
        },
      };

      const ipAddress = req.ip || req.connection?.remoteAddress;
      const user = await this.userService.register(registerRequest.registrationData);
      return {
        data: {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role.name,
          },
        },
        message: SUCCESS_MESSAGES.AUTH.REGISTER_SUCCESS,
      };
    } catch (error) {
      // Registration failed - audit log será manejado por interceptores
      throw error;
    }
  }

  async getUserProfile(req: ExpressRequest): Promise<IUserProfileResponse> {
    const userId = (req as any).user?.userId;

    if (!userId) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const userResponse = await this.userService.findUserById({ id: userId }, req);
    return {
      data: {
        id: userResponse.data.id,
        username: userResponse.data.username,
        email: userResponse.data.email,
        role: userResponse.data.role,
        createdAt: userResponse.data.createdAt,
        updatedAt: userResponse.data.updatedAt,
      },
      message: SUCCESS_MESSAGES.AUTH.PROFILE_FETCHED,
    };
  }
}
