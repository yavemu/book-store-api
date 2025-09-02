import { PublishingHouse } from '../entities/publishing-house.entity';
import { PublishingHouseFiltersDto } from '../dto/publishing-house-filters.dto';
import { PublishingHouseCsvExportFiltersDto } from '../dto/publishing-house-csv-export-filters.dto';
import { PublishingHouseExactSearchDto } from '../dto/publishing-house-exact-search.dto';
import { PublishingHouseSimpleFilterDto } from '../dto/publishing-house-simple-filter.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IPublishingHouseSearchService {
  exactSearch(searchDto: PublishingHouseExactSearchDto): Promise<PaginatedResult<PublishingHouse>>;
  simpleFilter(
    term: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>>;
  findWithFilters(
    filters: PublishingHouseFiltersDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>>;
  exportToCsv(filters: PublishingHouseCsvExportFiltersDto): Promise<string>;

  // Legacy methods for backward compatibility
  search(searchTerm: any, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  findByCountry(
    country: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResult<PublishingHouse>>;
}
