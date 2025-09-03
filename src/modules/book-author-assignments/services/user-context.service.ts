import { Injectable } from '@nestjs/common';
import { IUserContextService } from '../interfaces';

@Injectable()
export class UserContextService implements IUserContextService {
  extractUserId(request: any): string {
    return request?.user?.id || '';
  }

  getCurrentUser(request: any): { id: string; [key: string]: any } {
    return request?.user || { id: '' };
  }
}
