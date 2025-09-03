import { Injectable, Inject } from '@nestjs/common';
import { IUserAuthService } from '../interfaces';
import { IAuditLoggerService } from '../../audit/interfaces';
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
