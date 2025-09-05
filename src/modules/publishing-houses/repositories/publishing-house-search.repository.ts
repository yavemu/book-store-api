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
    pagination?: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const whereCondition: any = {};

      // Build WHERE conditions for all provided fields (WHERE AND exact match)
      if (searchDto.name) {
        whereCondition.name = searchDto.name;
      }
      if (searchDto.country) {
        whereCondition.country = searchDto.country;
      }
      if (searchDto.websiteUrl) {
        whereCondition.websiteUrl = searchDto.websiteUrl;
      }

      // If no search criteria provided, return empty result
      if (Object.keys(whereCondition).length === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            page: pagination?.page || 1,
            limit: pagination?.limit || 10,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      }

      const paginationData = pagination || {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'DESC' as 'DESC' | 'ASC',
        get offset(): number {
          return (this.page - 1) * this.limit;
        },
      };
      const options: FindManyOptions<PublishingHouse> = {
        where: whereCondition,
        order: { [paginationData.sortBy || 'createdAt']: paginationData.sortOrder || 'DESC' },
        skip: paginationData.offset,
        take: paginationData.limit,
      };

      return await this._findManyWithPagination(options, paginationData);
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
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const maxLimit = Math.min(pagination.limit || 10, 50);

      // If no search term provided, return all publishing houses with pagination
      if (!term || term.trim().length === 0) {
        const options: FindManyOptions<PublishingHouse> = {
          order: { [pagination.sortBy || 'createdAt']: pagination.sortOrder || 'DESC' },
          skip: pagination.offset,
          take: maxLimit,
        };
        return await this._findManyWithPagination(options, pagination);
      }

      // Validate minimum search term length
      const trimmedTerm = term.trim();
      if (trimmedTerm.length < 3) {
        throw new HttpException(
          'Search term must be at least 3 characters long',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Use TypeORM QueryBuilder for efficient LIKE queries across all fields
      const queryBuilder = this.repository
        .createQueryBuilder('publisher')
        .where('publisher.deletedAt IS NULL') // Soft delete filter
        .andWhere(
          '(LOWER(publisher.name) LIKE LOWER(:term) OR ' +
            'LOWER(publisher.country) LIKE LOWER(:term) OR ' +
            'LOWER(publisher.websiteUrl) LIKE LOWER(:term))',
          { term: `%${trimmedTerm}%` },
        );

      // Get total count for pagination metadata
      const totalCount = await queryBuilder.getCount();

      // Apply sorting and pagination
      queryBuilder
        .orderBy(`publisher.${pagination.sortBy || 'createdAt'}`, pagination.sortOrder || 'DESC')
        .skip(pagination.offset)
        .take(maxLimit);

      const publishers = await queryBuilder.getMany();

      // Return using standard pagination format
      return {
        data: publishers,
        meta: {
          total: totalCount,
          page: pagination.page,
          limit: maxLimit,
          totalPages: Math.ceil(totalCount / maxLimit),
          hasNext: pagination.offset + maxLimit < totalCount,
          hasPrev: pagination.page > 1,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to perform simple filter', HttpStatus.INTERNAL_SERVER_ERROR);
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
    return this.simpleFilterPublishingHouses(searchTerm, pagination);
  }

  async getPublishersByCountry(
    country: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.findWithFilters({ country }, pagination);
  }
}
