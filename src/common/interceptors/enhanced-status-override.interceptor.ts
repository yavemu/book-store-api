import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import {
  HttpStatusConfig,
  HTTP_STATUS_CONFIG_TOKEN,
  HttpStatusRule,
} from '../config/http-status.config';

@Injectable()
export class EnhancedStatusOverrideInterceptor implements NestInterceptor {
  private readonly logger = new Logger(EnhancedStatusOverrideInterceptor.name);

  constructor(
    @Inject(HTTP_STATUS_CONFIG_TOKEN)
    private readonly config: HttpStatusConfig,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, path } = request;
    const originalStatus = response.statusCode;

    // Find matching rule for this request
    const matchingRule = this.findMatchingRule(method, path);

    if (matchingRule) {
      response.status(matchingRule.statusCode);

      if (this.config.enableLogging) {
        this.logger.debug(`Status override applied: ${method} ${path}`, {
          originalStatus,
          newStatus: matchingRule.statusCode,
          rule: matchingRule.description,
          url,
        });
      }
    }

    return next.handle().pipe(
      tap(() => {
        // Additional logging for monitoring
        if (this.config.enableLogging && matchingRule) {
          this.logger.debug(`Request completed with overridden status: ${response.statusCode}`);
        }
      }),
    );
  }

  private findMatchingRule(method: string, path: string): HttpStatusRule | null {
    return (
      this.config.rules.find(
        (rule) =>
          rule.method.toLowerCase() === method.toLowerCase() &&
          this.matchesPathPattern(path, rule.pathPattern),
      ) || null
    );
  }

  private matchesPathPattern(path: string, pattern: string): boolean {
    // Support for exact match and contains match
    if (pattern.startsWith('/') && pattern.endsWith('/')) {
      // Regex pattern (future enhancement)
      const regex = new RegExp(pattern.slice(1, -1));
      return regex.test(path);
    }

    // Simple contains match
    return path.includes(pattern);
  }

  /**
   * Get all configured rules for documentation/debugging
   */
  getRules(): HttpStatusRule[] {
    return [...this.config.rules];
  }

  /**
   * Check if a specific path would be affected by status override
   */
  wouldOverrideStatus(method: string, path: string): boolean {
    return this.findMatchingRule(method, path) !== null;
  }
}
