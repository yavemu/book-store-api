import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserCrudService } from '../../users/interfaces/user-crud.service.interface';
import { IUserSearchService } from '../../users/interfaces/user-search.service.interface';
import { IUserAuthService } from '../../users/interfaces/user-auth.service.interface';
import { IAuditLoggerService } from '../../../modules/audit/interfaces/audit-logger.service.interface';
import { AuditAction } from '../../../modules/audit/enums/audit-action.enum';
import { User } from '../../users/entities/user.entity';
import { RegisterUserDto } from '../../users/dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserCrudService')
    private readonly userCrudService: IUserCrudService,
    @Inject('IUserSearchService')
    private readonly userSearchService: IUserSearchService,
    @Inject('IUserAuthService')
    private readonly userAuthService: IUserAuthService,
    @Inject('IAuditLoggerService')
    private readonly auditLogService: IAuditLoggerService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string, ipAddress?: string): Promise<User | null> {
    try {
      const user = await this.userSearchService.findToLoginByEmail(email);

      if (!user) {
        // Usuario no encontrado
        await this.auditLogService.logError(
          email, // Usar email como performedBy en caso de fallo
          AuditAction.LOGIN,
          'User',
          `Login failed: User not found for email ${email}`,
          ipAddress,
          'AuthService',
        );
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        // Contraseña incorrecta
        await this.auditLogService.logError(
          user.id,
          AuditAction.LOGIN,
          'User',
          `Login failed: Invalid password for user ${email}`,
          ipAddress,
          'AuthService',
        );
        return null;
      }

      return user;
    } catch (error) {
      // Error del sistema durante validación
      await this.auditLogService.logError(
        email,
        AuditAction.LOGIN,
        'User',
        `Login failed: System error - ${error.message}`,
        ipAddress,
        'AuthService',
      );
      throw error;
    }
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

  async register(registerUserDto: RegisterUserDto, ipAddress?: string) {
    try {
      const user = await this.userCrudService.register(registerUserDto);
      return {
        message: 'Usuario creado exitosamente',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      // Log registro fallido
      await this.auditLogService.logError(
        registerUserDto.email, // Usar email como identifier
        AuditAction.REGISTER,
        'User',
        `Registration failed: ${error.message}`,
        ipAddress,
        'AuthService',
      );
      throw error;
    }
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
