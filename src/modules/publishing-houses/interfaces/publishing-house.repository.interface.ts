import { PublishingHouse } from '../entities/publishing-house.entity';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

export interface IPublishingHouseRepository {
  registerPublisher(createPublishingHouseDto: CreatePublishingHouseDto): Promise<PublishingHouse>;
  getPublisherProfile(publisherId: string): Promise<PublishingHouse>;
  updatePublisherProfile(publisherId: string, updatePublishingHouseDto: UpdatePublishingHouseDto): Promise<PublishingHouse>;
  deactivatePublisher(publisherId: string): Promise<void>;
  searchPublishers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  getAllPublishers(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  getPublishersByCountry(country: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  checkPublisherNameExists(publisherName: string): Promise<boolean>;
}