import {
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { IPublishingHouseSearchRepository } from '../interfaces/publishing-house-search.repository.interface';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class PublishingHouseSearchRepository extends BaseRepository<PublishingHouse> implements IPublishingHouseSearchRepository {
  constructor(
    @InjectRepository(PublishingHouse)
    private readonly publisherRepository: Repository<PublishingHouse>,
  ) {
    super(publisherRepository);
  }

  async searchPublishers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const options: FindManyOptions<PublishingHouse> = {
        where: [{ name: ILike(`%${searchTerm}%`) }, { country: ILike(`%${searchTerm}%`) }],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException("Failed to search publishers", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPublishersByCountry(country: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const options: FindManyOptions<PublishingHouse> = {
        where: { country },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException("Failed to get publishers by country", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkNameExists(name: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { name: name.trim() },
      });
    } catch (error) {
      throw new HttpException("Failed to check publisher name existence", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
