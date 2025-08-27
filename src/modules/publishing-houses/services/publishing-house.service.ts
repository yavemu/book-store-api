import { Injectable, Inject } from '@nestjs/common';
import { IPublishingHouseRepository } from '../interfaces/publishing-house.repository.interface';
import { IPublishingHouseService } from '../interfaces/publishing-house.service.interface';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';

@Injectable()
export class PublishingHouseService implements IPublishingHouseService {
  constructor(
    @Inject('IPublishingHouseRepository')
    private readonly publishingHouseRepository: IPublishingHouseRepository,
  ) {}

  async create(createPublishingHouseDto: CreatePublishingHouseDto, performedBy: string): Promise<PublishingHouse> {
    return await this.publishingHouseRepository.registerPublisher(createPublishingHouseDto, performedBy);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    return await this.publishingHouseRepository.getAllPublishers(pagination);
  }

  async findById(id: string): Promise<PublishingHouse> {
    return await this.publishingHouseRepository.getPublisherProfile(id);
  }

  async update(id: string, updatePublishingHouseDto: UpdatePublishingHouseDto, performedBy: string): Promise<PublishingHouse> {
    return await this.publishingHouseRepository.updatePublisherProfile(id, updatePublishingHouseDto, performedBy);
  }

  async softDelete(id: string, performedBy: string): Promise<void> {
    await this.publishingHouseRepository.deactivatePublisher(id, performedBy);
  }

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    return await this.publishingHouseRepository.searchPublishers(searchTerm, pagination);
  }

  async findByCountry(country: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    return await this.publishingHouseRepository.getPublishersByCountry(country, pagination);
  }
}