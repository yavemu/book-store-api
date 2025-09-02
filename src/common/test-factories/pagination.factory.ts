import { PaginationDto } from '../dto/pagination.dto';
import { DeepPartial } from 'typeorm';
import { BaseFactory } from './base.factory';

/**
 * Factory for creating PaginationDto objects and paginated results for testing
 */
export class PaginationFactory extends BaseFactory<PaginationDto> {
  create(overrides?: DeepPartial<PaginationDto>): PaginationDto {
    const pagination = new PaginationDto();
    pagination.page = 1;
    pagination.limit = 10;
    pagination.sortBy = 'createdAt';
    pagination.sortOrder = 'DESC';

    return Object.assign(pagination, overrides);
  }

  /**
   * Creates pagination for first page
   */
  createFirstPage(limit: number = 10, overrides?: DeepPartial<PaginationDto>): PaginationDto {
    return this.create({
      page: 1,
      limit,
      ...overrides,
    });
  }

  /**
   * Creates pagination for a specific page
   */
  createPage(
    page: number,
    limit: number = 10,
    overrides?: DeepPartial<PaginationDto>,
  ): PaginationDto {
    return this.create({
      page,
      limit,
      ...overrides,
    });
  }

  /**
   * Creates pagination with ascending sort
   */
  createAscending(
    sortBy: string = 'createdAt',
    overrides?: DeepPartial<PaginationDto>,
  ): PaginationDto {
    return this.create({
      sortBy,
      sortOrder: 'ASC',
      ...overrides,
    });
  }

  /**
   * Creates pagination with descending sort
   */
  createDescending(
    sortBy: string = 'createdAt',
    overrides?: DeepPartial<PaginationDto>,
  ): PaginationDto {
    return this.create({
      sortBy,
      sortOrder: 'DESC',
      ...overrides,
    });
  }

  /**
   * Creates large page size pagination
   */
  createLargePage(limit: number = 100, overrides?: DeepPartial<PaginationDto>): PaginationDto {
    return this.create({
      limit,
      ...overrides,
    });
  }

  /**
   * Creates a paginated result for testing
   */
  createPaginatedResult<T>(
    data: T[],
    pagination: PaginationDto,
    total?: number,
  ): { data: T[]; meta: any } {
    const actualTotal = total ?? data.length;
    const totalPages = Math.ceil(actualTotal / pagination.limit);
    const hasNext = pagination.page < totalPages;
    const hasPrev = pagination.page > 1;

    return {
      data,
      meta: {
        total: actualTotal,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  /**
   * Creates an empty paginated result
   */
  createEmptyResult<T>(): { data: T[]; meta: any } {
    return {
      data: [],
      meta: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  /**
   * Creates a paginated result with specific meta data
   */
  createResultWithMeta<T>(
    data: T[],
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    },
  ): { data: T[]; meta: any } {
    return { data, meta };
  }
}
