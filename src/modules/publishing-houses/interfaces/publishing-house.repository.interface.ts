import { PublishingHouse } from '../entities/publishing-house.entity';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import {
  PaginationDto,
  PaginatedResult,
} from '../../../common/dto/pagination.dto';
import { SuccessResponseDto } from '../../../common/dto/success-response.dto';

export interface IPublishingHouseRepository {
  registerPublisher(
    createPublishingHouseDto: CreatePublishingHouseDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<PublishingHouse>>;
  getPublisherProfile(
    publisherId: string,
  ): Promise<SuccessResponseDto<PublishingHouse>>;
  updatePublisherProfile(
    publisherId: string,
    updatePublishingHouseDto: UpdatePublishingHouseDto,
    performedBy?: string,
  ): Promise<SuccessResponseDto<PublishingHouse>>;
  deactivatePublisher(
    publisherId: string,
    performedBy?: string,
  ): Promise<SuccessResponseDto<{ id: string }>>;
  searchPublishers(
    searchTerm: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<PublishingHouse>>>;
  getAllPublishers(
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<PublishingHouse>>>;
  getPublishersByCountry(
    country: string,
    pagination: PaginationDto,
  ): Promise<SuccessResponseDto<PaginatedResult<PublishingHouse>>>;
  checknameExists(name: string): Promise<boolean>;
}