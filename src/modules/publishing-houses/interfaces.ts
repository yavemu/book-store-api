// Unified interfaces file for publishing-houses module

import { HttpStatus } from '@nestjs/common';
import { PublishingHouse } from './entities/publishing-house.entity';
import { PaginationDto, PaginatedResult } from '../../common/dto/pagination.dto';
import { IBaseRepository } from '../../common/interfaces/base-repository.interface';

// Re-export common types for convenience
export { PaginationDto, PaginatedResult };

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface IPublishingHouseCrudService {
  create(dto: any, userId: string): Promise<PublishingHouse>;
  findAll(pagination: PaginationDto, userId: string): Promise<PaginatedResult<PublishingHouse>>;
  findById(id: string, userId: string): Promise<PublishingHouse>;
  update(id: string, dto: any, userId: string): Promise<PublishingHouse>;
  softDelete(id: string, userId: string): Promise<void>;
}

export interface IPublishingHouseSearchService {
  exactSearch(dto: any, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<PublishingHouse>>;
  simpleFilter(term: string, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<PublishingHouse>>;
  advancedFilter(filters: any, pagination: PaginationDto, userId?: string): Promise<PaginatedResult<PublishingHouse>>;
  exportToCsv(filters?: any, res?: any, userId?: string): Promise<string>;
}

// Alias for controller compatibility
export interface IPublishingHouseService extends IPublishingHouseCrudService {}

export interface IValidationService {
  validateUniqueConstraints<T>(
    dto: Partial<T>,
    entityId?: string,
    constraints?: Array<{
      field: string | string[];
      message: string;
      transform?: (value: any) => any;
    }>,
    repository?: any,
  ): Promise<void>;
}

export interface IErrorHandlerService {
  handleError(error: any, fallbackMessage: string, fallbackStatus?: HttpStatus): never;
  createNotFoundException(message: string): never;
  createConflictException(message: string): never;
}

export interface IUserContextService {
  extractUserId(request: any): string;
  getCurrentUser(request: any): { id: string; [key: string]: any };
}

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface IPublishingHouseCrudRepository {
  createPublishingHouse(dto: any, performedBy: string): Promise<PublishingHouse>;
  getAllPublishingHouses(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  getPublishingHouseById(id: string): Promise<PublishingHouse | null>;
  updatePublishingHouse(id: string, dto: any, performedBy: string): Promise<PublishingHouse>;
  deletePublishingHouse(id: string, performedBy?: string): Promise<void>;
}

export interface IPublishingHouseSearchRepository {
  exactSearchPublishingHouses(searchDto: any): Promise<PaginatedResult<PublishingHouse>>;
  simpleFilterPublishingHouses(term: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  findPublishingHousesWithFilters(filters: any, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  exportPublishingHousesToCsv(filters: any): Promise<string>;
}

// Re-export for backward compatibility
export { IBaseRepository };