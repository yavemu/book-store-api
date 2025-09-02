import { PublishingHouse } from '../entities/publishing-house.entity';
import { PublishingHouseFiltersDto } from '../dto/publishing-house-filters.dto';
import { PublishingHouseCsvExportFiltersDto } from '../dto/publishing-house-csv-export-filters.dto';
import { PublishingHouseExactSearchDto } from '../dto/publishing-house-exact-search.dto';
import { PublishingHouseSimpleFilterDto } from '../dto/publishing-house-simple-filter.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IPublishingHouseSearchRepository {
  exactSearchPublishingHouses(
    searchDto: PublishingHouseExactSearchDto,
  ): Promise<PaginatedResult<PublishingHouse>>;
  simpleFilterPublishingHouses(
    filterDto: PublishingHouseSimpleFilterDto,
  ): Promise<PaginatedResult<PublishingHouse>>;
  checkNameExists(name: string): Promise<boolean>;
  findWithFilters(
    filters: PublishingHouseFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>>;
  exportToCsv(filters: PublishingHouseCsvExportFiltersDto): Promise<string>;

  // Legacy methods for backward compatibility
  searchPublishers(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>>;
  getPublishersByCountry(
    country: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>>;
}
