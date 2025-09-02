import { Injectable, Inject } from '@nestjs/common';
import { IPublishingHouseSearchService } from '../interfaces/publishing-house-search.service.interface';
import { IPublishingHouseSearchRepository } from '../interfaces/publishing-house-search.repository.interface';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { PublishingHouseFiltersDto } from '../dto/publishing-house-filters.dto';
import { PublishingHouseCsvExportFiltersDto } from '../dto/publishing-house-csv-export-filters.dto';
import { PublishingHouseExactSearchDto } from '../dto/publishing-house-exact-search.dto';
import { PublishingHouseSimpleFilterDto } from '../dto/publishing-house-simple-filter.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class PublishingHouseSearchService implements IPublishingHouseSearchService {
  constructor(
    @Inject('IPublishingHouseSearchRepository')
    private readonly publishingHouseSearchRepository: IPublishingHouseSearchRepository,
  ) {}

  async exactSearch(
    searchDto: PublishingHouseExactSearchDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.publishingHouseSearchRepository.exactSearchPublishingHouses(searchDto);
  }

  async simpleFilter(
    filterDto: PublishingHouseSimpleFilterDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.publishingHouseSearchRepository.simpleFilterPublishingHouses(filterDto);
  }

  async findWithFilters(
    filters: PublishingHouseFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.publishingHouseSearchRepository.findWithFilters(filters, pagination);
  }

  async exportToCsv(filters: PublishingHouseCsvExportFiltersDto): Promise<string> {
    return this.publishingHouseSearchRepository.exportToCsv(filters);
  }

  // Legacy method names for backward compatibility with tests
  async search(
    searchTerm: any,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    const searchDto = {
      searchField: 'name',
      searchValue: searchTerm,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
      offset: pagination.offset,
      limit: pagination.limit,
      page: pagination.page,
    };
    return this.exactSearch(searchDto);
  }

  async findByCountry(
    country: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.findWithFilters({ country }, pagination);
  }
}
