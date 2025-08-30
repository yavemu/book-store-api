import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SUCCESS_MESSAGES } from '../constants';

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        return {
          data: response?.data ?? response ?? [],
          meta: response?.meta ?? undefined,
          message: response?.message ?? SUCCESS_MESSAGES.GENERAL.OPERATION_SUCCESS,
        };
      }),
    );
  }
}
