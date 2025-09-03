// Unified interfaces file for auth module

import { User } from '../users/entities/user.entity';
import { RegisterUserDto } from '../users/dto/register-user.dto';

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IAuthService {
  validateUser(email: string, password: string, ipAddress?: string): Promise<User | null>;
  login(email: string, password: string, ipAddress?: string): Promise<{
    access_token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: any;
    };
    message: string;
  }>;
  register(registerUserDto: RegisterUserDto, ipAddress?: string): Promise<{
    message: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: any;
    };
  }>;
  getProfile(userId: string): Promise<{
    data: {
      id: string;
      username: string;
      email: string;
      role: any;
      createdAt: Date;
      updatedAt: Date;
    };
    message: string;
  }>;
}