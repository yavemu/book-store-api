import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import { IAuditLogRepository } from '../interfaces/audit-log.repository.interface';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class AuditLogRepository extends BaseRepository<AuditLog> implements IAuditLogRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {
    super(auditLogRepository);
  }

  // Public business logic methods

  async logUserAction(
    performedBy: string,
    entityId: string,
    action: AuditAction,
    details: string,
    entityType: string,
  ): Promise<AuditLog> {
    try {
      // Use inherited method from BaseRepository
      return await this._createEntity({
        performedBy,
        entityId,
        action,
        details,
        entityType,
      });
    } catch (error) {
      throw new HttpException('Failed to log user action', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAuditTrail(pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
      const options: FindManyOptions<AuditLog> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get audit trail', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserAuditHistory(userId: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
      const options: FindManyOptions<AuditLog> = {
        where: { performedBy: userId },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get user audit history', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getEntityAuditHistory(entityId: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
      const options: FindManyOptions<AuditLog> = {
        where: { entityId },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get entity audit history', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAuditsByAction(action: AuditAction, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
      const options: FindManyOptions<AuditLog> = {
        where: { action },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get audits by action', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAuditsByEntityType(entityType: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
      const options: FindManyOptions<AuditLog> = {
        where: { entityType },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get audits by entity type', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchAuditLogs(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<AuditLog>> {
    try {
      const options: FindManyOptions<AuditLog> = {
        where: [
          { details: ILike(`%${searchTerm}%`) },
          { entityType: ILike(`%${searchTerm}%`) },
        ],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to search audit logs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}