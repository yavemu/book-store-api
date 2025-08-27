import { Injectable, Inject } from '@nestjs/common';
import { IPublishingHouseRepository } from '../interfaces/publishing-house.repository.interface';
import { IPublishingHouseService } from '../interfaces/publishing-house.service.interface';
import { IAuditLogService } from '../../audit/interfaces';
import { PublishingHouse } from '../entities/publishing-house.entity';
import { CreatePublishingHouseDto } from '../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../dto/update-publishing-house.dto';
import { PaginationDto, PaginatedResult } from '../../../common/dto/pagination.dto';
import { AuditAction } from '../../audit/enums/audit-action.enum';

@Injectable()
export class PublishingHouseService implements IPublishingHouseService {
  constructor(
    @Inject('IPublishingHouseRepository')
    private readonly publishingHouseRepository: IPublishingHouseRepository,
    @Inject('IAuditLogService')
    private readonly auditService: IAuditLogService,
  ) {}

  async create(createPublishingHouseDto: CreatePublishingHouseDto, performedBy: string): Promise<PublishingHouse> {
    const publishingHouse = await this.publishingHouseRepository.registerPublisher(createPublishingHouseDto);
    
    await this.auditService.log(
      performedBy,
      publishingHouse.id,
      AuditAction.CREATE,
      `Created publishing house: ${publishingHouse.publisherName}`,
      'PublishingHouse'
    );

    return publishingHouse;
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    return await this.publishingHouseRepository.getAllPublishers(pagination);
  }

  async findById(id: string): Promise<PublishingHouse> {
    return await this.publishingHouseRepository.getPublisherProfile(id);
  }

  async update(id: string, updatePublishingHouseDto: UpdatePublishingHouseDto, performedBy: string): Promise<PublishingHouse> {
    const publishingHouse = await this.publishingHouseRepository.updatePublisherProfile(id, updatePublishingHouseDto);
    
    await this.auditService.log(
      performedBy,
      publishingHouse.id,
      AuditAction.UPDATE,
      `Updated publishing house: ${publishingHouse.publisherName}`,
      'PublishingHouse'
    );

    return publishingHouse;
  }

  async softDelete(id: string, performedBy: string): Promise<void> {
    const publishingHouse = await this.publishingHouseRepository.getPublisherProfile(id);
    await this.publishingHouseRepository.deactivatePublisher(id);
    
    await this.auditService.log(
      performedBy,
      id,
      AuditAction.DELETE,
      `Deleted publishing house: ${publishingHouse.publisherName}`,
      'PublishingHouse'
    );
  }

  async search(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    return await this.publishingHouseRepository.searchPublishers(searchTerm, pagination);
  }

  async findByCountry(country: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    return await this.publishingHouseRepository.getPublishersByCountry(country, pagination);
  }
}