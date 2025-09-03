import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { IPublishingHouseCrudRepository } from '../interfaces';
import { PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';
import {
  ICreatePublishingHouseParams,
  IGetPublishingHouseByIdParams,
  IGetAllPublishingHousesParams,
  IUpdatePublishingHouseParams,
  IDeletePublishingHouseParams,
} from '../interfaces';

@Injectable()
export class PublishingHouseCrudRepository
  extends BaseRepository<PublishingHouse>
  implements IPublishingHouseCrudRepository
{
  constructor(
    @InjectRepository(PublishingHouse)
    protected readonly repository: Repository<PublishingHouse>,
  ) {
    super(repository);
  }

  async createPublisher(params: ICreatePublishingHouseParams): Promise<PublishingHouse> {
    return await this._create(
      params.createPublishingHouseDto,
      params.performedBy,
      'PublishingHouse',
      (publisher) => `Publisher created: ${publisher.name}`,
    );
  }

  async getPublisherById(params: IGetPublishingHouseByIdParams): Promise<PublishingHouse> {
    return await this._findById(params.publisherId);
  }

  async getAllPublishers(
    params: IGetAllPublishingHousesParams,
  ): Promise<PaginatedResult<PublishingHouse>> {
    const options = {
      order: { [params.pagination.sortBy]: params.pagination.sortOrder },
      skip: params.pagination.offset,
      take: params.pagination.limit,
    };

    return await this._findManyWithPagination(options, params.pagination);
  }

  async updatePublisher(params: IUpdatePublishingHouseParams): Promise<PublishingHouse> {
    return await this._update(
      params.publisherId,
      params.updatePublishingHouseDto,
      params.performedBy,
      'PublishingHouse',
      () => `Publisher updated: ${params.publisherId}`,
    );
  }

  async deletePublisher(params: IDeletePublishingHouseParams): Promise<{ id: string }> {
    return await this._softDelete(
      params.publisherId,
      params.performedBy,
      'PublishingHouse',
      () => `Publisher deleted: ${params.publisherId}`,
    );
  }

  async findByName(name: string): Promise<PublishingHouse> {
    return await this._findByField('name', name);
  }

  async findByNameExcludingId(name: string, excludeId: string): Promise<PublishingHouse> {
    return await this._findByField('name', name, { excludeId });
  }

  async checkNameExists(name: string, excludeId?: string): Promise<boolean> {
    return await this._existsByField('name', name, excludeId);
  }
}
