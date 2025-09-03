import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiExtraModels, getSchemaPath, ApiResponseOptions } from '@nestjs/swagger';

export interface ApiFormattedResponseOptions {
  status?: number;
  description?: string;
  type?: Type<any>;
  isArray?: boolean;
  isPaginated?: boolean;
}

export function ApiFormattedResponse(options: ApiFormattedResponseOptions) {
  const decorators = [];

  // Add extra models for reference
  if (options.type) {
    decorators.push(ApiExtraModels(options.type));
  }

  // Build response schema
  const responseSchema: any = {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
        description: 'Indicates if the operation was successful',
      },
      statusCode: {
        type: 'number',
        example: options.status || 200,
        description: 'HTTP status code',
      },
      message: {
        type: 'string',
        example: 'Operation completed successfully',
        description: 'Human readable message',
      },
      data: options.type
        ? options.isArray
          ? {
              type: 'array',
              items: { $ref: getSchemaPath(options.type) },
            }
          : {
              $ref: getSchemaPath(options.type),
            }
        : {
            description: 'Response data',
          },
      meta: {
        type: 'object',
        properties: {
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00.000Z',
            description: 'Response timestamp',
          },
          path: {
            type: 'string',
            example: '/api/v1/users',
            description: 'Request path',
          },
          method: {
            type: 'string',
            example: 'GET',
            description: 'HTTP method',
          },
          version: {
            type: 'string',
            example: '1.0.0',
            description: 'API version',
          },
          requestId: {
            type: 'string',
            example: 'req_1640995200000_abc123xyz',
            description: 'Unique request identifier',
          },
          ...(options.isPaginated && {
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'number',
                  example: 1,
                  description: 'Current page number',
                },
                limit: {
                  type: 'number',
                  example: 10,
                  description: 'Items per page',
                },
                total: {
                  type: 'number',
                  example: 100,
                  description: 'Total number of items',
                },
                totalPages: {
                  type: 'number',
                  example: 10,
                  description: 'Total number of pages',
                },
              },
            },
          }),
        },
      },
    },
  };

  const apiResponseOptions: ApiResponseOptions = {
    status: options.status || 200,
    description: options.description || 'Operation completed successfully',
    schema: responseSchema,
  };

  decorators.push(ApiResponse(apiResponseOptions));

  return applyDecorators(...decorators);
}

// Convenience decorators for common response types
export const ApiSuccessResponse = (options: Omit<ApiFormattedResponseOptions, 'status'> = {}) =>
  ApiFormattedResponse({ ...options, status: 200 });

export const ApiCreatedResponse = (options: Omit<ApiFormattedResponseOptions, 'status'> = {}) =>
  ApiFormattedResponse({ ...options, status: 201 });

export const ApiPaginatedResponse = (type: Type<any>, description?: string) =>
  ApiFormattedResponse({
    type,
    isArray: true,
    isPaginated: true,
    description: description || 'Paginated list retrieved successfully',
  });
