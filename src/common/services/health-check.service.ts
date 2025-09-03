import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: ServiceHealth;
    memory: ServiceHealth;
    disk?: ServiceHealth;
  };
  metadata: {
    nodeVersion: string;
    platform: string;
    hostname: string;
  };
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  details?: any;
  error?: string;
}

@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger(HealthCheckService.name);
  private readonly startTime = Date.now();

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getHealthStatus(): Promise<HealthStatus> {
    const services = await this.checkServices();
    const overallStatus = this.calculateOverallStatus(services);

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: process.env.API_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services,
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        hostname: process.env.HOSTNAME || 'unknown',
      },
    };
  }

  private async checkServices(): Promise<HealthStatus['services']> {
    return {
      database: await this.checkDatabase(),
      memory: this.checkMemory(),
    };
  }

  private async checkDatabase(): Promise<ServiceHealth> {
    try {
      const startTime = Date.now();

      // Simple ping query
      await this.connection.query('SELECT 1');

      const responseTime = Date.now() - startTime;

      return {
        status: responseTime > 1000 ? 'degraded' : 'up',
        responseTime,
        details: {
          connectionName: this.connection.name,
          isConnected: this.connection.isConnected,
        },
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return {
        status: 'down',
        error: error.message,
      };
    }
  }

  private checkMemory(): ServiceHealth {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    const memoryUtilization = (usedMemory / totalMemory) * 100;

    return {
      status: memoryUtilization > 90 ? 'degraded' : 'up',
      details: {
        heapUsed: `${Math.round(usedMemory / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(totalMemory / 1024 / 1024)}MB`,
        utilization: `${memoryUtilization.toFixed(1)}%`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      },
    };
  }

  private calculateOverallStatus(services: HealthStatus['services']): HealthStatus['status'] {
    const serviceStatuses = Object.values(services).map((service) => service.status);

    if (serviceStatuses.every((status) => status === 'up')) {
      return 'healthy';
    } else if (serviceStatuses.some((status) => status === 'down')) {
      return 'unhealthy';
    } else {
      return 'degraded';
    }
  }

  async isHealthy(): Promise<boolean> {
    const health = await this.getHealthStatus();
    return health.status === 'healthy';
  }

  async isDegraded(): Promise<boolean> {
    const health = await this.getHealthStatus();
    return health.status === 'degraded';
  }
}
