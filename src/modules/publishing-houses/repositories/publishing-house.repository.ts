import { Injectable, NotFoundException, ConflictException, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions, ILike } from "typeorm";
import { PublishingHouse } from "../entities/publishing-house.entity";
import { IPublishingHouseRepository } from "../interfaces/publishing-house.repository.interface";
import { CreatePublishingHouseDto } from "../dto/create-publishing-house.dto";
import { UpdatePublishingHouseDto } from "../dto/update-publishing-house.dto";
import { PaginationDto, PaginatedResult } from "../../../common/dto/pagination.dto";
import { BaseRepository } from "../../../common/repositories/base.repository";

@Injectable()
export class PublishingHouseRepository extends BaseRepository<PublishingHouse> implements IPublishingHouseRepository {
  constructor(
    @InjectRepository(PublishingHouse)
    private readonly publisherRepository: Repository<PublishingHouse>,
  ) {
    super(publisherRepository);
  }

  // Public business logic methods

  async registerPublisher(createPublishingHouseDto: CreatePublishingHouseDto): Promise<PublishingHouse> {
    try {
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(createPublishingHouseDto, undefined, [
        {
          field: 'publisherName',
          message: 'Publisher name already exists',
          transform: (value: string) => value.trim()
        }
      ]);

      // Use inherited method from BaseRepository
      return await this._createEntity(createPublishingHouseDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to register publisher', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPublisherProfile(publisherId: string): Promise<PublishingHouse> {
    try {
      const publisher = await this._findById(publisherId);
      if (!publisher) {
        throw new NotFoundException('Publisher not found');
      }
      return publisher;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get publisher profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePublisherProfile(publisherId: string, updatePublishingHouseDto: UpdatePublishingHouseDto): Promise<PublishingHouse> {
    try {
      const publisher = await this.getPublisherProfile(publisherId);
      
      // Validate uniqueness using inherited method with specific configuration
      await this._validateUniqueConstraints(updatePublishingHouseDto, publisherId, [
        {
          field: 'publisherName',
          message: 'Publisher name already exists',
          transform: (value: string) => value.trim()
        }
      ]);

      // Use inherited method from BaseRepository
      await this._updateEntity(publisherId, updatePublishingHouseDto);
      return await this._findById(publisherId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to update publisher profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deactivatePublisher(publisherId: string): Promise<void> {
    try {
      await this.getPublisherProfile(publisherId); // Verify publisher exists
      // Use inherited method from BaseRepository
      await this._softDelete(publisherId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to deactivate publisher', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchPublishers(searchTerm: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const options: FindManyOptions<PublishingHouse> = {
        where: [
          { publisherName: ILike(`%${searchTerm}%`) },
          { country: ILike(`%${searchTerm}%`) },
        ],
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to search publishers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllPublishers(pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const options: FindManyOptions<PublishingHouse> = {
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get all publishers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPublishersByCountry(country: string, pagination: PaginationDto): Promise<PaginatedResult<PublishingHouse>> {
    try {
      const options: FindManyOptions<PublishingHouse> = {
        where: { country },
        order: { [pagination.sortBy]: pagination.sortOrder },
        skip: pagination.offset,
        take: pagination.limit,
      };

      return await this._findManyWithPagination(options, pagination);
    } catch (error) {
      throw new HttpException('Failed to get publishers by country', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkPublisherNameExists(publisherName: string): Promise<boolean> {
    try {
      return await this._exists({ 
        where: { publisherName: publisherName.trim() } 
      });
    } catch (error) {
      throw new HttpException('Failed to check publisher name existence', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}