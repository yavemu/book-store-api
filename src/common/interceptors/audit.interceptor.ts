import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IAuditLogService } from '../../modules/audit/interfaces/audit-log.service.interface';
import { AuditAction } from '../../modules/audit/enums/audit-action.enum';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @Inject('IAuditLogService')
    private readonly auditLogService: IAuditLogService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const user = request.user;

    return next.handle().pipe(
      tap(async (response) => {
        if (user && this.shouldAudit(method, url)) {
          const action = this.getAuditAction(method);
          const entityType = this.getEntityType(url);
          const entityId = this.getEntityId(url, response);
          const details = this.getDetails(method, url, response);

          if (action && entityType && entityId) {
            await this.auditLogService.logOperation(
              user.userId,
              entityId,
              action,
              details,
              entityType,
            );
          }
        }
      }),
    );
  }

  private shouldAudit(method: string, url: string): boolean {
    const auditablePaths = ['/auth/', '/users/'];
    const auditableMethods = ['POST', 'PUT', 'DELETE'];
    
    return auditableMethods.includes(method) && 
           auditablePaths.some(path => url.includes(path));
  }

  private getAuditAction(method: string): AuditAction | null {
    switch (method) {
      case 'POST':
        return AuditAction.CREATE;
      case 'PUT':
        return AuditAction.UPDATE;
      case 'DELETE':
        return AuditAction.DELETE;
      default:
        return null;
    }
  }

  private getEntityType(url: string): string | null {
    if (url.includes('/users/')) return 'User';
    if (url.includes('/auth/')) return 'Auth';
    return null;
  }

  private getEntityId(url: string, response: any): string | null {
    const urlParts = url.split('/');
    const idFromUrl = urlParts[urlParts.length - 1];
    
    if (idFromUrl && idFromUrl !== 'register' && idFromUrl !== 'login') {
      return idFromUrl;
    }
    
    if (response && response.id) {
      return response.id;
    }
    
    if (response && response.user && response.user.id) {
      return response.user.id;
    }
    
    return 'unknown';
  }

  private getDetails(method: string, url: string, response: any): string {
    const action = method.toLowerCase();
    const entity = this.getEntityType(url)?.toLowerCase() || 'entity';
    
    if (url.includes('/auth/register')) {
      return `User registered: ${response?.user?.username || 'unknown'}`;
    }
    
    if (url.includes('/auth/login')) {
      return `User logged in: ${response?.user?.username || 'unknown'}`;
    }
    
    return `${action} operation on ${entity}`;
  }
}