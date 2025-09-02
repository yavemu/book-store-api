import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PostStatusOverrideInterceptor implements NestInterceptor {
  private readonly searchFilterPaths = ['/search', '/filter', '/advanced-filter'];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const method = request.method;
    const url = request.url;

    // Check if this is a POST endpoint with search/filter semantics
    if (method === 'POST' && this.isSearchOrFilterEndpoint(url)) {
      // Override the status code to 200 for search/filter operations
      response.status(200);
    }

    return next.handle();
  }

  private isSearchOrFilterEndpoint(url: string): boolean {
    return this.searchFilterPaths.some((path) => url.includes(path));
  }
}
