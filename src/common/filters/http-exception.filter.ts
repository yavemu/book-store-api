import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      // This handles class-validator responses and other structured messages
      const resp = exceptionResponse as { message: string | string[] };
      message = Array.isArray(resp.message) ? resp.message.join(', ') : resp.message;
    } else {
      message = 'An unexpected error occurred';
    }

    // Ensure all responses go through BusinessException for consistent format
    const businessException = new BusinessException(
      message,
      status as HttpStatus,
    );

    response.status(status).json(businessException.getResponse());
  }
}
