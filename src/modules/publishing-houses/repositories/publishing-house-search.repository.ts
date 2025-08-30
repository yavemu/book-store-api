import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike, Between } from 'typeorm';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { PublishingHouseFiltersDto } from '../dto/publishing-house-filters.dto';
import { PublishingHouseCsvExportFiltersDto } from '../dto/publishing-house-csv-export-filters.dto';
import { IPublishingHouseSearchRepository } from '../interfaces/publishing-house-search.repository.interface';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { BaseRepository } from '../../../common/repositories/base.repository';

@Injectable()
export class PublishingHouseSearchRepository
  extends BaseRepository<PublishingHouse>
  implements IPublishingHouseSearchRepository
{
  constructor(
    @InjectRepository(PublishingHouse)
    private readonly publisherRepository: Repository<PublishingHouse>,
  ) {
    super(publisherRepository);
  }

  async searchPublishers(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const options: FindManyOptions<PublishingHouse> = {
        where: [{ name: ILike(`%${searchTerm}%`) }, { country: ILike(`%${searchTerm}%`) }],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to search publishers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPublishersByCountry(
    country: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const options: FindManyOptions<PublishingHouse> = {
        where: { country },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException(
        'Failed to get publishers by country',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkNameExists(name: string): Promise<boolean> {
    try {
      return await this._exists({
        where: { name: name.trim() },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to check publisher name existence',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findWithFilters(
    filters: PublishingHouseFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const whereConditions: any = {};

      if (filters.name) {
        whereConditions.name = ILike(`%${filters.name}%`);
      }
      if (filters.country) {
        whereConditions.country = ILike(`%${filters.country}%`);
      }
      if (filters.websiteUrl) {
        whereConditions.websiteUrl = ILike(`%${filters.websiteUrl}%`);
      }
      if (filters.createdAfter && filters.createdBefore) {
        whereConditions.createdAt = Between(
          new Date(filters.createdAfter),
          new Date(filters.createdBefore),
        );
      }

      const options: FindManyOptions<PublishingHouse> = {
        where: whereConditions,
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException(
        'Failed to filter publishing houses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async exportToCsv(filters: PublishingHouseCsvExportFiltersDto): Promise<string> {
    try {
      const whereConditions: any = {};

      if (filters.name) {
        whereConditions.name = ILike(`%${filters.name}%`);
      }
      if (filters.country) {
        whereConditions.country = ILike(`%${filters.country}%`);
      }
      if (filters.websiteUrl) {
        whereConditions.websiteUrl = ILike(`%${filters.websiteUrl}%`);
      }
      if (filters.startDate && filters.endDate) {
        whereConditions.createdAt = Between(new Date(filters.startDate), new Date(filters.endDate));
      }

      const publishingHouses = await this.publisherRepository.find({
        where: whereConditions,
        order: { createdAt: 'DESC' },
      });

      const csvHeaders = 'ID,Name,Country,Website URL,Created At,Updated At\n';
      const csvRows = publishingHouses
        .map((house) => {
          return `${house.id},"${house.name}","${house.country || ''}","${house.websiteUrl || ''}","${house.createdAt?.toISOString()}","${house.updatedAt?.toISOString()}"`;
        })
        .join('\n');

      return csvHeaders + csvRows;
    } catch (error) {
      throw new HttpException(
        'Failed to export publishing houses to CSV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
