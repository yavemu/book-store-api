import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { QueryFailedError } from 'typeorm';

export interface ErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  error: string;
  details?: any;
  meta: {
    timestamp: string;
    path: string;
    method: string;
    requestId?: string;
    stack?: string;
  };
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    // Log the error
    this.logError(exception, request, errorResponse);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(exception: unknown, request: Request): ErrorResponse {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'INTERNAL_ERROR';
    let details: any = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        message = (response as any).message || exception.message;
        error = (response as any).error || exception.name;
        details = (response as any).details;
      } else {
        message = (response as string) || exception.message;
        error = exception.name;
      }
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = this.handleDatabaseError(exception);
      error = 'DATABASE_ERROR';
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;

      // Handle specific error types
      if (exception.name === 'ValidationError') {
        statusCode = HttpStatus.BAD_REQUEST;
        error = 'VALIDATION_ERROR';
      } else if (exception.name === 'UnauthorizedError') {
        statusCode = HttpStatus.UNAUTHORIZED;
        error = 'UNAUTHORIZED';
      }
    }

    return {
      success: false,
      statusCode,
      message,
      error,
      ...(details && { details }),
      meta: {
        timestamp: new Date().toISOString(),
        path: request.path,
        method: request.method,
        requestId: this.getRequestId(request),
        ...(process.env.NODE_ENV === 'development' &&
          exception instanceof Error && { stack: exception.stack }),
      },
    };
  }

  private handleDatabaseError(error: QueryFailedError): string {
    const { code, detail } = (error.driverError as any) || {};

    // PostgreSQL error codes
    switch (code) {
      case '23505': // unique_violation
        return 'A record with this information already exists';
      case '23503': // foreign_key_violation
        return 'Referenced record does not exist';
      case '23502': // not_null_violation
        return 'Required field is missing';
      case '23514': // check_violation
        return 'Invalid data format or value';
      default:
        return detail || 'Database operation failed';
    }
  }

  private getRequestId(request: Request): string {
    return (request.headers['x-request-id'] ||
      request.headers['x-correlation-id'] ||
      `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`) as string;
  }

  private logError(exception: unknown, request: Request, errorResponse: ErrorResponse): void {
    const logContext = {
      statusCode: errorResponse.statusCode,
      path: request.path,
      method: request.method,
      userAgent: request.headers['user-agent'],
      userId: (request as any).user?.userId,
      requestId: errorResponse.meta.requestId,
      message: errorResponse.message,
      error: errorResponse.error,
    };

    if (errorResponse.statusCode >= 500) {
      this.logger.error(
        `Internal Server Error: ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : String(exception),
        logContext,
      );
    } else if (errorResponse.statusCode >= 400) {
      this.logger.warn(`Client Error: ${errorResponse.message}`, logContext);
    } else {
      this.logger.log(`Exception handled: ${errorResponse.message}`, logContext);
    }
  }
}
