import { Injectable, NotFoundException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Response } from 'express';
import { AuditLog } from '../entities/audit-log.entity';
import { IAuditCrudRepository } from '../interfaces';
import { IBaseRepository } from '../interfaces';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseAuditRepository } from '../../../common/repositories/base-audit.repository';
import { AUDIT_ERROR_MESSAGES } from '../enums/error-messages.enum';

@Injectable()
export class AuditCrudRepository
  extends BaseAuditRepository<AuditLog>
  implements Omit<IAuditCrudRepository, keyof IBaseRepository<AuditLog>>
{
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {
    super(auditRepository);
  }

  async getAllAuditLogs(pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
      const options: FindManyOptions<AuditLog> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException(
        AUDIT_ERROR_MESSAGES.FAILED_TO_GET_ALL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuditLogById(id: string): Promise<AuditLog> {
    try {
      const auditLog = await this._findById(id);
      if (!auditLog) {
        throw new NotFoundException(AUDIT_ERROR_MESSAGES.NOT_FOUND);
      }
      return auditLog;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        AUDIT_ERROR_MESSAGES.FAILED_TO_GET_ONE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteAuditLog(id: string, performedBy?: string): Promise<void> {
    try {
      await this.getAuditLogById(id);
      await this.softDeleteWithoutAudit(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        AUDIT_ERROR_MESSAGES.FAILED_TO_DELETE,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async exportAuditLogsToCsv(filters: any, res: Response): Promise<void> {
    try {
      // Basic CSV export functionality
      const whereConditions: any = {};

      if (filters.entityType) {
        whereConditions.entityType = filters.entityType;
      }

      if (filters.action) {
        whereConditions.action = filters.action;
      }

      if (filters.performedBy) {
        whereConditions.performedBy = filters.performedBy;
      }

      const auditLogs = await this._findMany({
        where: whereConditions,
        order: { createdAt: 'DESC' },
        take: 10000, // Limit for export
      });

      // Set CSV headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');

      // CSV header
      const csvHeader = 'ID,Performed By,Entity ID,Action,Entity Type,Details,Result,Created At\\n';
      res.write(csvHeader);

      // CSV rows
      for (const log of auditLogs) {
        const csvRow = `"${log.id}","${log.performedBy}","${log.entityId || ''}","${log.action}","${log.entityType}","${(log.details || '').replace(/"/g, '""')}","${log.result || ''}","${log.createdAt}"\\n`;
        res.write(csvRow);
      }

      res.end();
    } catch (error) {
      throw new HttpException(
        AUDIT_ERROR_MESSAGES.FAILED_TO_EXPORT_CSV,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
