import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { IAuditLogRepository } from '../interfaces/audit-log.repository.interface';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class AuditLogRepository implements IAuditLogRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  // Public business logic methods

  async logUserAction(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog> {
    try {
      // Direct implementation without BaseRepository to avoid circular dependency
      const auditLog = this.auditLogRepository.create({
        performedBy,
        entityId,
        action,
        details,
        entityType,
      });
      return await this.auditLogRepository.save(auditLog);
    } catch (error) {
      throw new HttpException('Failed to log user action', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAuditTrail(pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
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
    } catch (error) {
      throw new HttpException('Failed to get audit trail', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserAuditHistory(userId: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
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
    } catch (error) {
      throw new HttpException('Failed to get user audit history', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getEntityAuditHistory(entityId: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
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
    } catch (error) {
      throw new HttpException('Failed to get entity audit history', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAuditsByAction(action: AuditAction, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
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
    } catch (error) {
      throw new HttpException('Failed to get audits by action', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAuditsByEntityType(entityType: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
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
    } catch (error) {
      throw new HttpException('Failed to get audits by entity type', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchAuditLogs(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
      const [data, total] = await this.auditLogRepository.findAndCount({
        where: [
          { details: ILike(`%${searchTerm}%`) },
          { entityType: ILike(`%${searchTerm}%`) },
        ],
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
    } catch (error) {
      throw new HttpException('Failed to search audit logs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}