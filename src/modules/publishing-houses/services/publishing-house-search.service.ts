import { Injectable, Inject } from '@nestjs/common';
import { IPublishingHouseSearchService } from '../interfaces/publishing-house-search.service.interface';
import { IPublishingHouseSearchRepository } from '../interfaces/publishing-house-search.repository.interface';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { PublishingHouseFiltersDto } from '../dto/publishing-house-filters.dto';
import { PublishingHouseCsvExportFiltersDto } from '../dto/publishing-house-csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class PublishingHouseSearchService implements IPublishingHouseSearchService {
  constructor(
    @Inject('IPublishingHouseSearchRepository')
    private readonly publishingHouseSearchRepository: IPublishingHouseSearchRepository,
  ) {}

  async search(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.publishingHouseSearchRepository.searchPublishers(searchTerm, pagination);
  }

  async findByCountry(
    country: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.publishingHouseSearchRepository.getPublishersByCountry(country, pagination);
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
}
