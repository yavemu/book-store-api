import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';

export interface RequestMetrics {
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  userId?: string;
  timestamp: Date;
  error?: string;
}

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MetricsInterceptor.name);
  private readonly metrics: Map<string, number> = new Map();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, path, headers } = request;
    const userId = (request as any).user?.userId;

    return next.handle().pipe(
      tap(() => {
        this.recordMetrics({
          method,
          path,
          statusCode: response.statusCode,
          responseTime: Date.now() - startTime,
          userAgent: headers['user-agent'],
          userId,
          timestamp: new Date(),
        });
      }),
      catchError((error) => {
        this.recordMetrics({
          method,
          path,
          statusCode: error.status || 500,
          responseTime: Date.now() - startTime,
          userAgent: headers['user-agent'],
          userId,
          timestamp: new Date(),
          error: error.message,
        });
        throw error;
      }),
    );
  }

  private recordMetrics(metrics: RequestMetrics): void {
    // Log metrics
    const logData = {
      method: metrics.method,
      path: metrics.path,
      statusCode: metrics.statusCode,
      responseTime: `${metrics.responseTime}ms`,
      userId: metrics.userId,
      timestamp: metrics.timestamp.toISOString(),
      ...(metrics.error && { error: metrics.error }),
    };

    if (metrics.statusCode >= 400) {
      this.logger.warn(`Request failed`, logData);
    } else if (metrics.responseTime > 1000) {
      this.logger.warn(`Slow request detected`, logData);
    } else {
      this.logger.log(`Request completed`, logData);
    }

    // Update counters
    const counterKey = `${metrics.method}_${metrics.path}_${Math.floor(metrics.statusCode / 100)}xx`;
    this.metrics.set(counterKey, (this.metrics.get(counterKey) || 0) + 1);

    // Track response time percentiles (simplified)
    const responseTimeKey = `${metrics.method}_${metrics.path}_response_time`;
    const currentAvg = this.metrics.get(responseTimeKey) || 0;
    const count = this.metrics.get(`${counterKey}_count`) || 0;
    this.metrics.set(responseTimeKey, (currentAvg * count + metrics.responseTime) / (count + 1));
    this.metrics.set(`${counterKey}_count`, count + 1);
  }

  /**
   * Get current metrics for health check or monitoring dashboard
   */
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics.entries());
  }

  /**
   * Reset metrics (useful for testing or periodic cleanup)
   */
  resetMetrics(): void {
    this.metrics.clear();
    this.logger.log('Metrics reset');
  }
}
