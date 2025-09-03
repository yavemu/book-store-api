import { Injectable, Inject } from '@nestjs/common';
import { IPublishingHouseService } from '../interfaces';
import { IPublishingHouseCrudService } from '../interfaces';
import { IPublishingHouseSearchService } from '../interfaces';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import { PublishingHouseFiltersDto } from '../dto/publishing-house-filters.dto';
import { PublishingHouseCsvExportFiltersDto } from '../dto/publishing-house-csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class PublishingHouseService implements IPublishingHouseService {
  constructor(
    @Inject('IPublishingHouseCrudService')
    private readonly crudService: IPublishingHouseCrudService,
    @Inject('IPublishingHouseSearchService')
    private readonly searchService: IPublishingHouseSearchService,
  ) {}

  async create(
    createPublishingHouseDto: CreatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse> {
    return this.crudService.create(createPublishingHouseDto, performedBy);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    return this.crudService.findAll(pagination);
  }

  async findById(id: string): Promise<PublishingHouse> {
    return this.crudService.findById(id);
  }

  async update(
    id: string,
    updatePublishingHouseDto: UpdatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse> {
    return this.crudService.update(id, updatePublishingHouseDto, performedBy);
  }

  async softDelete(id: string, performedBy: string): Promise<{ id: string }> {
    return this.crudService.softDelete(id, performedBy);
  }

  async search(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.searchService.search(searchTerm, pagination);
  }

  async findByCountry(
    country: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.searchService.findByCountry(country, pagination);
  }

  async findWithFilters(
    filters: PublishingHouseFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>> {
    return this.searchService.findWithFilters(filters, pagination);
  }

  async exportToCsv(filters: PublishingHouseCsvExportFiltersDto): Promise<string> {
    return this.searchService.exportToCsv(filters);
  }
}
