import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IAuditLoggerService } from '../../modules/audit/interfaces/audit-logger.service.interface';
import { AuditAction } from '../../modules/audit/enums/audit-action.enum';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @Inject("IAuditLoggerService")
    private readonly auditLogService: IAuditLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const user = request.user;
    const userId = user?.userId || "unknown";

    return next.handle().pipe(
      tap(async (response) => {
        const action = this.getAuditAction(method);
        const entityId = this.getEntityId(url, response);
        const details = `${action} operation on endpoint ${url}`;

        await this.auditLogService.logOperation(userId, entityId, action, details, url);
      }),
    );
  }

  private getAuditAction(method: string): AuditAction | null {
    switch (method) {
      case "POST":
        return AuditAction.CREATE;
      case "PUT":
        return AuditAction.UPDATE;
      case "DELETE":
        return AuditAction.DELETE;
      case "GET":
        return AuditAction.READ;
      default:
        return null;
    }
  }

  private getEntityId(url: string, response: any): string | null {
    const urlParts = url.split("/");
    const idFromUrl = urlParts[urlParts.length - 1];

    if (idFromUrl) {
      return idFromUrl;
    }

    if (response && response.id) {
      return response.id;
    }

    if (response && response.user && response.user.id) {
      return response.user.id;
    }

    return "unknown";
  }
}