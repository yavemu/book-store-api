import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

// Services
import { HealthCheckService } from './services/health-check.service';

// Interceptors
import { EnhancedStatusOverrideInterceptor } from './interceptors/enhanced-status-override.interceptor';
import { EnhancedResponseFormatInterceptor } from './interceptors/enhanced-response-format.interceptor';
import { MetricsInterceptor } from './interceptors/metrics.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { AuditInterceptor } from './interceptors/audit.interceptor';

// Filters
import { GlobalExceptionFilter } from './filters/global-exception.filter';

// Configuration
import { HTTP_STATUS_CONFIG, HTTP_STATUS_CONFIG_TOKEN } from './config/http-status.config';

@Global()
@Module({
  providers: [
    // Services
    HealthCheckService,

    // Configuration
    {
      provide: HTTP_STATUS_CONFIG_TOKEN,
      useValue: HTTP_STATUS_CONFIG,
    },

    // Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },

    // Interceptors (order matters - they execute in reverse order for responses)
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: EnhancedStatusOverrideInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: EnhancedResponseFormatInterceptor,
    },
  ],
  exports: [HealthCheckService, HTTP_STATUS_CONFIG_TOKEN],
})
export class CommonModule {}
