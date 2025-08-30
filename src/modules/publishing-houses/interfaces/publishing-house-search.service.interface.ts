import { PublishingHouse } from '../entities/publishing-house.entity';
import { PublishingHouseFiltersDto } from '../dto/publishing-house-filters.dto';
import { PublishingHouseCsvExportFiltersDto } from '../dto/publishing-house-csv-export-filters.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IPublishingHouseSearchService {
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
}
