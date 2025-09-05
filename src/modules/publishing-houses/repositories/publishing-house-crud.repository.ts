import { Injectable, NotFoundException, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { IPublishingHouseCrudRepository } from '../interfaces/publishing-house-crud.repository.interface';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { IAuditLoggerService } from '../../../modules/audit/interfaces/audit-logger.service.interface';

@Injectable()
export class PublishingHouseCrudRepository
  extends BaseRepository<PublishingHouse>
  implements IPublishingHouseCrudRepository
{
  constructor(
    @InjectRepository(PublishingHouse)
    private readonly publisherRepository: Repository<PublishingHouse>,
    @Inject('IAuditLoggerService')
    protected readonly auditLogService: IAuditLoggerService,
  ) {
    super(publisherRepository, auditLogService);
  }

  async registerPublisher(
    createPublishingHouseDto: CreatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse> {
    try {
      await this._validateUniqueConstraints(createPublishingHouseDto, undefined, [
        {
          field: 'name',
          message: 'Publisher name already exists',
          transform: (value: string) => value.trim(),
        },
      ]);

      return await this._create(
        createPublishingHouseDto,
        performedBy,
        'PublishingHouse',
        (publisher) => `Publisher registered: ${publisher.name}`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to register publisher', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPublisherProfile(publisherId: string): Promise<PublishingHouse> {
    try {
      const publisher = await this._findById(publisherId);
      if (!publisher) {
        throw new NotFoundException('Publisher not found');
      }
      return publisher;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get publisher profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePublisherProfile(
    publisherId: string,
    updatePublishingHouseDto: UpdatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse> {
    try {
      await this.getPublisherProfile(publisherId);

      await this._validateUniqueConstraints(updatePublishingHouseDto, publisherId, [
        {
          field: 'name',
          message: 'Publisher name already exists',
          transform: (value: string) => value.trim(),
        },
      ]);

      return await this._update(
        publisherId,
        updatePublishingHouseDto,
        performedBy,
        'PublishingHouse',
        (publisher) => `Publisher ${publisher.id} updated.`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to update publisher profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deactivatePublisher(publisherId: string, performedBy: string): Promise<{ id: string }> {
    try {
      const publisher = await this.getPublisherProfile(publisherId);
      return await this._softDelete(
        publisherId,
        performedBy,
        'PublishingHouse',
        () => `Publisher ${publisher.id} deactivated.`,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to deactivate publisher', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllPublishers(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const options: FindManyOptions<PublishingHouse> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get all publishers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findForSelect(): Promise<PublishingHouse[]> {
    return await this._findMany({
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });
  }
}
