import { PublishingHouse } from '../entities/publishing-house.entity';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IPublishingHouseSearchService {
  search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  findByCountry(country: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
}
