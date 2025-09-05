import { PublishingHouse } from '../entities/publishing-house.entity';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import { PublishingHouseFiltersDto } from '../dto/publishing-house-filters.dto';
import { PublishingHouseCsvExportFiltersDto } from '../dto/publishing-house-csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { ListSelectDto } from '../../../common/dto/list-select.dto';

export interface IPublishingHouseService {
  create(
    createPublishingHouseDto: CreatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse>;
  findAll(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  findById(id: string): Promise<PublishingHouse>;
  update(
    id: string,
    updatePublishingHouseDto: UpdatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse>;
  softDelete(id: string, performedBy: string): Promise<{ id: string }>;
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  findByCountry(
    country: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>>;
  findWithFilters(
    filters: PublishingHouseFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>>;
  exportToCsv(filters: PublishingHouseCsvExportFiltersDto): Promise<string>;
  findForSelect(): Promise<ListSelectDto[]>;
}
