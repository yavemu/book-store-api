import { PublishingHouse } from '../entities/publishing-house.entity';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';


export interface IPublishingHouseRepository {
  registerPublisher(createPublishingHouseDto: CreatePublishingHouseDto, performedBy: string): Promise<PublishingHouse>;
  getPublisherProfile(publisherId: string): Promise<PublishingHouse>;
  updatePublisherProfile(
    publisherId: string,
    updatePublishingHouseDto: UpdatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse>;
  deactivatePublisher(publisherId: string, performedBy: string): Promise<{ id: string }>;
  searchPublishers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  getAllPublishers(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  getPublishersByCountry(country: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>>;
  checknameExists(name: string): Promise<boolean>;
}