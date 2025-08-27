import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../users/services/user.service';
import { User } from '../../users/entities/user.entity';
import { AuditLogService } from '../../audit/services/audit-log.service';
import { AuditAction } from '../../audit/entities/audit-log.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);
    
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    
    return null;
  }

  async login(user: User) {
    const payload = { 
      username: user.username, 
      sub: user.id,
      role: user.role 
    };

    await this.auditLogService.logOperation(
      user.id,
      user.id,
      AuditAction.LOGIN,
      `User logged in: ${user.username}`,
      'Auth',
    );
    
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

  async getProfile(userId: string): Promise<User> {
    return this.userService.findById(userId);
  }
}