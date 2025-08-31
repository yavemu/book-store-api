import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { IAuditSearchRepository } from '../interfaces/audit-search.repository.interface';
import { AuditFiltersDto } from '../dto/audit-filters.dto';
import { AuditCsvExportFiltersDto } from '../dto/audit-csv-export-filters.dto';
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

  async exportToCsv(filters: AuditCsvExportFiltersDto): Promise<string> {
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
        return `${log.id},"${log.action}","${log.entityType}","${log.entityId}","${log.performedBy}","${log.createdAt?.toISOString()}","${log.details || ''}"`;
      })
      .join('\n');

    return csvHeaders + csvRows;
  }
}
