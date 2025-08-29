import { PublishingHouse } from '../entities/publishing-house.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IPublishingHouseSearchRepository {
  searchPublishers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  getPublishersByCountry(country: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  checkNameExists(name: string): Promise<boolean>;
}
