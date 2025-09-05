import { Injectable, Inject } from '@nestjs/common';
import { IPublishingHouseCrudService } from '../interfaces/publishing-house-crud.service.interface';
import { IPublishingHouseCrudRepository } from '../interfaces/publishing-house-crud.repository.interface';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { ListSelectDto } from '../../../common/dto/list-select.dto';

@Injectable()
export class PublishingHouseCrudService implements IPublishingHouseCrudService {
  constructor(
    @Inject('IPublishingHouseCrudRepository')
    private readonly publishingHouseCrudRepository: IPublishingHouseCrudRepository,
  ) {}

  async create(
    createPublishingHouseDto: CreatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse> {
    return this.publishingHouseCrudRepository.registerPublisher(
      createPublishingHouseDto,
      performedBy,
    );
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    return this.publishingHouseCrudRepository.getAllPublishers(pagination);
  }

  async findById(id: string): Promise<PublishingHouse> {
    return this.publishingHouseCrudRepository.getPublisherProfile(id);
  }

  async update(
    id: string,
    updatePublishingHouseDto: UpdatePublishingHouseDto,
    performedBy: string,
  ): Promise<PublishingHouse> {
    return this.publishingHouseCrudRepository.updatePublisherProfile(
      id,
      updatePublishingHouseDto,
      performedBy,
    );
  }

  async softDelete(id: string, performedBy: string): Promise<{ id: string }> {
    return this.publishingHouseCrudRepository.deactivatePublisher(id, performedBy);
  }

  async findForSelect(): Promise<ListSelectDto[]> {
    const publishers = await this.publishingHouseCrudRepository.findForSelect();
    return publishers.map((publisher) => ({
      id: publisher.id,
      name: publisher.name,
    }));
  }
}
