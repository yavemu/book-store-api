import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { IAuditSearchRepository } from '../interfaces/audit-search.repository.interface';
import {
  AuditFiltersDto,
  AuditExactSearchDto,
  AuditSimpleFilterDto,
  AuditCsvExportFiltersDto,
} from '../dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class AuditSearchRepository implements IAuditSearchRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async getAuditTrail(pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const totalPages = Math.ceil(total / pagination.limit);
    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  async getUserAuditHistory(
    userId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      where: { performedBy: userId },
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const totalPages = Math.ceil(total / pagination.limit);
    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  async getEntityAuditHistory(
    entityId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      where: { entityId },
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const totalPages = Math.ceil(total / pagination.limit);
    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  async getAuditsByAction(
    action: AuditAction,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      where: { action },
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const totalPages = Math.ceil(total / pagination.limit);
    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  async getAuditsByEntityType(
    entityType: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      where: { entityType },
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const totalPages = Math.ceil(total / pagination.limit);
    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  async searchAuditLogs(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      where: [{ details: ILike(`%${searchTerm}%`) }, { entityType: ILike(`%${searchTerm}%`) }],
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const totalPages = Math.ceil(total / pagination.limit);
    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  async getAuditById(id: string): Promise<AuditLog> {
    const audit = await this.auditLogRepository.findOne({ where: { id } });
    if (!audit) {
      throw new Error(`Audit log with ID ${id} not found`);
    }
    return audit;
  }

  async filterAudits(
    filterTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    const [data, total] = await this.auditLogRepository.findAndCount({
      where: [
        { entityType: ILike(`%${filterTerm}%`) },
        { details: ILike(`%${filterTerm}%`) },
        { performedBy: ILike(`%${filterTerm}%`) },
      ],
      order: { createdAt: 'DESC' },
      skip: pagination.offset,
      take: Math.min(pagination.limit, 50),
      cache: {
        id: `audit_filter_${filterTerm.toLowerCase()}_${pagination.page}_${pagination.limit}`,
        milliseconds: 30000,
      },
    });

    const totalPages = Math.ceil(total / pagination.limit);
    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  async findWithFilters(
    filters: AuditFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<AuditLog>> {
    const whereConditions: any = {};

    if (filters.action) {
      whereConditions.action = filters.action;
    }
    if (filters.entityType) {
      whereConditions.entityType = ILike(`%${filters.entityType}%`);
    }
    if (filters.entityId) {
      whereConditions.entityId = filters.entityId;
    }
    if (filters.performedBy) {
      whereConditions.performedBy = filters.performedBy;
    }
    if (filters.createdAfter && filters.createdBefore) {
      whereConditions.createdAt = Between(
        new Date(filters.createdAfter),
        new Date(filters.createdBefore),
      );
    }

    const [data, total] = await this.auditLogRepository.findAndCount({
      where: whereConditions,
      order: { [pagination.sortBy]: pagination.sortOrder },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const totalPages = Math.ceil(total / pagination.limit);
    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  async exportToCsv(filters?: AuditCsvExportFiltersDto): Promise<string> {
    const whereConditions: any = {};

    if (filters.action) {
      whereConditions.action = filters.action;
    }
    if (filters.entityType) {
      whereConditions.entityType = ILike(`%${filters.entityType}%`);
    }
    if (filters.entityId) {
      whereConditions.entityId = filters.entityId;
    }
    if (filters.performedBy) {
      whereConditions.performedBy = filters.performedBy;
    }
    if (filters.startDate && filters.endDate) {
      whereConditions.createdAt = Between(new Date(filters.startDate), new Date(filters.endDate));
    }

    const auditLogs = await this.auditLogRepository.find({
      where: whereConditions,
      order: { createdAt: 'DESC' },
    });

    const csvHeaders = 'ID,Action,Entity Type,Entity ID,Performed By,Timestamp,Details\n';
    const csvRows = auditLogs
      .map((log) => {
        return `${log.id},"${log.action}","${log.entityType}","${log.entityId}","${log.performedBy}","${this.formatDateTimeForCsv(log.createdAt)}","${log.details || ''}"`;
      })
      .join('\n');

    return csvHeaders + csvRows;
  }

  // Standardized search methods (following book-catalog pattern)
  async exactSearchAuditLogs(searchDto: AuditExactSearchDto): Promise<PaginatedResult<AuditLog>> {
    const whereCondition: any = {};
    whereCondition[searchDto.searchField] = searchDto.searchValue;

    const [data, total] = await this.auditLogRepository.findAndCount({
      where: whereCondition,
      order: { [searchDto.sortBy]: searchDto.sortOrder },
      skip: searchDto.offset,
      take: searchDto.limit,
    });

    const totalPages = Math.ceil(total / searchDto.limit);
    return {
      data,
      meta: {
        total,
        page: searchDto.page,
        limit: searchDto.limit,
        totalPages,
        hasNext: searchDto.page < totalPages,
        hasPrev: searchDto.page > 1,
      },
    };
  }

  async simpleFilterAuditLogs(term: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    if (!term || term.trim().length === 0) {
      // Return all logs if no search term
      return await this.getAuditTrail(pagination);
    }

    const trimmedTerm = term.trim();
    const [data, total] = await this.auditLogRepository.findAndCount({
      where: [
        { performedBy: ILike(`%${trimmedTerm}%`) },
        { entityId: ILike(`%${trimmedTerm}%`) },
        { details: ILike(`%${trimmedTerm}%`) },
        { entityType: ILike(`%${trimmedTerm}%`) },
      ],
      order: { [pagination.sortBy || 'createdAt']: pagination.sortOrder || 'DESC' },
      skip: pagination.offset,
      take: pagination.limit,
    });

    const totalPages = Math.ceil(total / pagination.limit);
    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    };
  }

  /**
   * Helper method to format datetime safely for CSV export
   * @private
   */
  private formatDateTimeForCsv(date: Date | string): string {
    try {
      if (!date) return '';

      // If it's a string, try to parse it as a Date
      if (typeof date === 'string') {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString();
        }
        return '';
      }

      // If it's a Date object, format it
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toISOString();
      }

      return '';
    } catch (error) {
      return '';
    }
  }
}
