import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckService, HealthStatus } from '../services/health-check.service';
import { MetricsInterceptor } from '../interceptors/metrics.interceptor';
import { Public } from '../decorators/auth.decorator';
import { ApiSuccessResponse } from '../decorators/api-response-format.decorator';

@ApiTags('Health & Monitoring')
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly metricsInterceptor: MetricsInterceptor,
  ) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Health Check',
    description: 'Returns the current health status of the application and its dependencies',
  })
  @ApiSuccessResponse({
    description: 'Health status retrieved successfully',
  })
  async getHealth(): Promise<HealthStatus> {
    return this.healthCheckService.getHealthStatus();
  }

  @Get('ready')
  @Public()
  @ApiOperation({
    summary: 'Readiness Check',
    description: 'Returns 200 if the application is ready to receive traffic',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is ready',
  })
  @ApiResponse({
    status: 503,
    description: 'Application is not ready',
  })
  async getReadiness(): Promise<{ status: string; ready: boolean }> {
    const isHealthy = await this.healthCheckService.isHealthy();
    const isDegraded = await this.healthCheckService.isDegraded();

    // Ready if healthy or degraded (but not unhealthy)
    const ready = isHealthy || isDegraded;

    return {
      status: ready ? 'ready' : 'not ready',
      ready,
    };
  }

  @Get('live')
  @Public()
  @ApiOperation({
    summary: 'Liveness Check',
    description: 'Returns 200 if the application is alive',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
  })
  async getLiveness(): Promise<{ status: string; alive: boolean }> {
    // Simple liveness check - if we can respond, we're alive
    return {
      status: 'alive',
      alive: true,
    };
  }

  @Get('metrics')
  @Public()
  @ApiOperation({
    summary: 'Application Metrics',
    description: 'Returns current application metrics and performance data',
  })
  @ApiSuccessResponse({
    description: 'Metrics retrieved successfully',
  })
  async getMetrics(): Promise<Record<string, number>> {
    return this.metricsInterceptor.getMetrics();
  }

  @Get('version')
  @Public()
  @ApiOperation({
    summary: 'Application Version',
    description: 'Returns the current application version information',
  })
  @ApiSuccessResponse({
    description: 'Version information retrieved successfully',
  })
  async getVersion(): Promise<{
    version: string;
    nodeVersion: string;
    environment: string;
    buildTime?: string;
  }> {
    return {
      version: process.env.API_VERSION || '1.0.0',
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      buildTime: process.env.BUILD_TIME,
    };
  }
}
