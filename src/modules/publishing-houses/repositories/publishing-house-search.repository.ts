import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike, Between } from 'typeorm';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { PublishingHouseFiltersDto } from '../dto/publishing-house-filters.dto';
import { PublishingHouseCsvExportFiltersDto } from '../dto/publishing-house-csv-export-filters.dto';
import { PublishingHouseExactSearchDto } from '../dto/publishing-house-exact-search.dto';
import { PublishingHouseSimpleFilterDto } from '../dto/publishing-house-simple-filter.dto';
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

  async exactSearchPublishingHouses(
    searchDto: PublishingHouseExactSearchDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const whereCondition: any = {};
      whereCondition[searchDto.searchField] = searchDto.searchValue;

      const options: FindManyOptions<PublishingHouse> = {
        where: whereCondition,
        order: { [searchDto.sortBy]: searchDto.sortOrder },
        skip: searchDto.offset,
        take: searchDto.limit,
      };

      return await this._findManyWithPagination(options, searchDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to search publishing houses',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async simpleFilterPublishingHouses(
    filterDto: PublishingHouseSimpleFilterDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    try {
      if (!filterDto.term || filterDto.term.trim() === '') {
        const options: FindManyOptions<PublishingHouse> = {
          order: { [filterDto.sortBy]: filterDto.sortOrder },
          skip: filterDto.offset,
          take: filterDto.limit,
        };
        return await this._findManyWithPagination(options, filterDto);
      }

      const allPublishingHousesOptions: FindManyOptions<PublishingHouse> = {
        order: { [filterDto.sortBy]: filterDto.sortOrder },
      };

      const allPublishingHouses = await this._findMany(allPublishingHousesOptions);
      const trimmedTerm = filterDto.term.trim().toLowerCase();

      const filteredPublishingHouses = allPublishingHouses.filter(
        (house) =>
          (house.name && house.name.toLowerCase().includes(trimmedTerm)) ||
          (house.country && house.country.toLowerCase().includes(trimmedTerm)) ||
          (house.websiteUrl && house.websiteUrl.toLowerCase().includes(trimmedTerm)),
      );

      const total = filteredPublishingHouses.length;
      const startIndex = filterDto.offset || 0;
      const endIndex = startIndex + (filterDto.limit || 10);
      const paginatedData = filteredPublishingHouses.slice(startIndex, endIndex);

      return this._buildPaginatedResult(paginatedData, total, filterDto);
    } catch (error) {
      throw new HttpException(
        'Failed to filter publishing houses',
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

      const publishingHouses = await this._findMany({
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

  // Legacy method names for backward compatibility with tests
  async searchPublishers(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    const filterDto = {
      term: searchTerm,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      offset: pagination.offset,
      limit: pagination.limit,
      page: pagination.page,
    };
    return this.simpleFilterPublishingHouses(filterDto);
  }

  async getPublishersByCountry(
    country: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.findWithFilters({ country }, pagination);
  }
}
