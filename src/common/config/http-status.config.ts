import { HttpStatus } from '@nestjs/common';

export interface HttpStatusRule {
  readonly method: string;
  readonly pathPattern: string;
  readonly statusCode: HttpStatus;
  readonly description: string;
}

export interface HttpStatusConfig {
  readonly rules: HttpStatusRule[];
  readonly defaultPostStatus: HttpStatus;
  readonly enableLogging: boolean;
}

export const HTTP_STATUS_CONFIG: HttpStatusConfig = {
  rules: [
    {
      method: 'POST',
      pathPattern: '/search',
      statusCode: HttpStatus.OK,
      description: 'Search operations should return 200 OK instead of 201 Created',
    },
    {
      method: 'POST',
      pathPattern: '/filter',
      statusCode: HttpStatus.OK,
      description: 'Filter operations should return 200 OK instead of 201 Created',
    },
    {
      method: 'POST',
      pathPattern: '/advanced-filter',
      statusCode: HttpStatus.OK,
      description: 'Advanced filter operations should return 200 OK instead of 201 Created',
    },
    {
      method: 'POST',
      pathPattern: '/export',
      statusCode: HttpStatus.OK,
      description: 'Export operations should return 200 OK instead of 201 Created',
    },
  ],
  defaultPostStatus: HttpStatus.CREATED,
  enableLogging: process.env.NODE_ENV === 'development',
};

export const HTTP_STATUS_CONFIG_TOKEN = 'HTTP_STATUS_CONFIG';
