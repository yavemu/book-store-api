import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { SUCCESS_MESSAGES } from '../constants';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    timestamp: string;
    path: string;
    method: string;
    version?: string;
    requestId?: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface PaginatedData<T = any> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class EnhancedResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data): ApiResponse => {
        const statusCode = response.statusCode;
        const isSuccess = statusCode >= 200 && statusCode < 300;

        // Handle different response types
        let formattedData = data;
        let pagination;

        // Check if response has pagination structure
        if (this.isPaginatedResponse(data)) {
          formattedData = data.items || data.data;
          pagination = data.pagination || data.meta?.pagination;
        } else if (this.isLegacyPaginatedResponse(data)) {
          // Handle legacy pagination format
          formattedData = data.data;
          pagination = data.meta;
        }

        return {
          success: isSuccess,
          statusCode,
          message: this.getResponseMessage(data, statusCode),
          data: formattedData ?? (isSuccess ? [] : null),
          meta: {
            timestamp: new Date().toISOString(),
            path: request.path,
            method: request.method,
            version: process.env.API_VERSION || '1.0.0',
            requestId: this.generateRequestId(request),
            ...(pagination && { pagination }),
          },
        };
      }),
    );
  }

  private isPaginatedResponse(data: any): boolean {
    return data && typeof data === 'object' && (data.items || data.data) && data.pagination;
  }

  private isLegacyPaginatedResponse(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      data.data &&
      data.meta &&
      typeof data.meta.page !== 'undefined'
    );
  }

  private getResponseMessage(data: any, statusCode: number): string {
    // Use provided message if available
    if (data?.message) {
      return data.message;
    }

    // Generate message based on status code
    switch (statusCode) {
      case HttpStatus.CREATED:
        return SUCCESS_MESSAGES.GENERAL.RESOURCE_CREATED || 'Resource created successfully';
      case HttpStatus.OK:
        return SUCCESS_MESSAGES.GENERAL.OPERATION_SUCCESS || 'Operation completed successfully';
      case HttpStatus.NO_CONTENT:
        return 'Operation completed successfully';
      default:
        return SUCCESS_MESSAGES.GENERAL.OPERATION_SUCCESS || 'Operation completed successfully';
    }
  }

  private generateRequestId(request: Request): string {
    // Use existing request ID if available, otherwise generate one
    const existingId = request.headers['x-request-id'] || request.headers['x-correlation-id'];
    if (existingId && typeof existingId === 'string') {
      return existingId;
    }

    // Generate simple request ID
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
