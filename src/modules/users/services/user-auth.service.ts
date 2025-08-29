import { Injectable, Inject } from '@nestjs/common';
import { IUserAuthService } from '../interfaces/user-auth.service.interface';
import { IAuditLoggerService } from '../../audit/interfaces/audit-logger.service.interface';
import { AuditAction } from '../../audit/enums/audit-action.enum';

@Injectable()
export class UserAuthService implements IUserAuthService {
  constructor(
    @Inject('IAuditLoggerService')
    private readonly auditLogService: IAuditLoggerService,
  ) {}

  async logLogin(userId: string): Promise<void> {
    await this.auditLogService.log(
      userId,
      userId,
      AuditAction.LOGIN,
      `User login successful`,
      'User',
    );
  }
}
