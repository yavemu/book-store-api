import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';
import { AuditAction } from '../enums/audit-action.enum';
import { IAuditLogRepository } from '../interfaces/audit-log.repository.interface';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';
import { SUCCESS_MESSAGES } from '../../../common/exceptions/success-messages';

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
  ): Promise<SuccessResponseDto<AuditLog>> {
    try {
      // Direct implementation without BaseRepository to avoid circular dependency
      const auditLog = this.auditLogRepository.create({
        performedBy,
        entityId,
        action,
        details,
        entityType,
      });
      const newLog = await this.auditLogRepository.save(auditLog);
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.GENERAL.OPERATION_SUCCESS,
        newLog,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to log user action',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuditTrail(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>> {
    try {
      const [data, total] = await this.auditLogRepository.findAndCount({
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      });

      const totalPages = Math.ceil(total / pagination.limit);
      const paginatedResult = {
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
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.GENERAL.DATA_FETCHED,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get audit trail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserAuditHistory(
    userId: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>> {
    try {
      const [data, total] = await this.auditLogRepository.findAndCount({
        where: { performedBy: userId },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      });

      const totalPages = Math.ceil(total / pagination.limit);
      const paginatedResult = {
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
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.GENERAL.DATA_FETCHED,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get user audit history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEntityAuditHistory(
    entityId: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>> {
    try {
      const [data, total] = await this.auditLogRepository.findAndCount({
        where: { entityId },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      });

      const totalPages = Math.ceil(total / pagination.limit);
      const paginatedResult = {
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
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.GENERAL.DATA_FETCHED,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get entity audit history',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuditsByAction(
    action: AuditAction,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>> {
    try {
      const [data, total] = await this.auditLogRepository.findAndCount({
        where: { action },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      });

      const totalPages = Math.ceil(total / pagination.limit);
      const paginatedResult = {
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
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.GENERAL.DATA_FETCHED,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get audits by action',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuditsByEntityType(
    entityType: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>> {
    try {
      const [data, total] = await this.auditLogRepository.findAndCount({
        where: { entityType },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      });

      const totalPages = Math.ceil(total / pagination.limit);
      const paginatedResult = {
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
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.GENERAL.DATA_FETCHED,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to get audits by entity type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchAuditLogs(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<AuditLog>>> {
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
      const paginatedResult = {
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
      return new SuccessResponseDto(
        SUCCESS_MESSAGES.GENERAL.DATA_FETCHED,
        paginatedResult,
      );
    } catch (error) {
      throw new HttpException(
        'Failed to search audit logs',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}