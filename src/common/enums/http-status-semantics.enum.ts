import { HttpStatus } from '@nestjs/common';

/**
 * Semantic HTTP status codes for different operation types
 * Following REST API best practices
 */
export const HTTP_STATUS_SEMANTICS = {
  // CREATE Operations
  RESOURCE_CREATED: HttpStatus.CREATED, // 201 - New resource created

  // READ Operations
  RESOURCE_FOUND: HttpStatus.OK, // 200 - Resource retrieved successfully
  NO_CONTENT: HttpStatus.NO_CONTENT, // 204 - Success but no content to return

  // UPDATE Operations
  RESOURCE_UPDATED: HttpStatus.OK, // 200 - Resource updated successfully

  // DELETE Operations
  RESOURCE_DELETED: HttpStatus.OK, // 200 - Resource deleted (soft delete)
  RESOURCE_PERMANENTLY_DELETED: HttpStatus.NO_CONTENT, // 204 - Resource permanently deleted

  // SEARCH/FILTER Operations (POST with query semantics)
  SEARCH_RESULTS: HttpStatus.OK, // 200 - Search completed successfully
  FILTER_RESULTS: HttpStatus.OK, // 200 - Filter applied successfully
  EXPORT_COMPLETED: HttpStatus.OK, // 200 - Export operation completed

  // BULK Operations
  BULK_OPERATION_COMPLETED: HttpStatus.OK, // 200 - Bulk operation completed
  BULK_OPERATION_PARTIAL: HttpStatus.MULTI_STATUS, // 207 - Some operations succeeded, some failed

  // CLIENT Errors
  VALIDATION_ERROR: HttpStatus.BAD_REQUEST, // 400 - Invalid input data
  UNAUTHORIZED: HttpStatus.UNAUTHORIZED, // 401 - Authentication required
  FORBIDDEN: HttpStatus.FORBIDDEN, // 403 - Access denied
  RESOURCE_NOT_FOUND: HttpStatus.NOT_FOUND, // 404 - Resource doesn't exist
  RESOURCE_CONFLICT: HttpStatus.CONFLICT, // 409 - Resource already exists or conflict
  UNPROCESSABLE_ENTITY: HttpStatus.UNPROCESSABLE_ENTITY, // 422 - Valid format but semantic errors

  // SERVER Errors
  INTERNAL_ERROR: HttpStatus.INTERNAL_SERVER_ERROR, // 500 - Unexpected server error
  SERVICE_UNAVAILABLE: HttpStatus.SERVICE_UNAVAILABLE, // 503 - Service temporarily unavailable
} as const;

export type HttpStatusSemantics =
  (typeof HTTP_STATUS_SEMANTICS)[keyof typeof HTTP_STATUS_SEMANTICS];

/**
 * Operation types for semantic status code selection
 */
export enum OperationType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  SEARCH = 'search',
  FILTER = 'filter',
  EXPORT = 'export',
  BULK = 'bulk',
  AUTHENTICATE = 'authenticate',
  AUTHORIZE = 'authorize',
}

/**
 * Maps operation types to their appropriate HTTP status codes
 */
export const OPERATION_STATUS_MAP: Record<OperationType, HttpStatusSemantics> = {
  [OperationType.CREATE]: HTTP_STATUS_SEMANTICS.RESOURCE_CREATED,
  [OperationType.READ]: HTTP_STATUS_SEMANTICS.RESOURCE_FOUND,
  [OperationType.UPDATE]: HTTP_STATUS_SEMANTICS.RESOURCE_UPDATED,
  [OperationType.DELETE]: HTTP_STATUS_SEMANTICS.RESOURCE_DELETED,
  [OperationType.SEARCH]: HTTP_STATUS_SEMANTICS.SEARCH_RESULTS,
  [OperationType.FILTER]: HTTP_STATUS_SEMANTICS.FILTER_RESULTS,
  [OperationType.EXPORT]: HTTP_STATUS_SEMANTICS.EXPORT_COMPLETED,
  [OperationType.BULK]: HTTP_STATUS_SEMANTICS.BULK_OPERATION_COMPLETED,
  [OperationType.AUTHENTICATE]: HTTP_STATUS_SEMANTICS.RESOURCE_FOUND,
  [OperationType.AUTHORIZE]: HTTP_STATUS_SEMANTICS.RESOURCE_FOUND,
};
