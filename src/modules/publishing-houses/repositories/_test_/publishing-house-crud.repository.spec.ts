import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublishingHouseCrudRepository } from '../publishing-house-crud.repository';
import { PublishingHouse } from '../../entities/publishing-house.entity';
import { CreatePublishingHouseDto, UpdatePublishingHouseDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { IAuditLoggerService } from '../../../audit/interfaces/audit-logger.service.interface';

const mockPublishingHouse: PublishingHouse = {
  id: '1',
  name: 'Test Publishing House',
  country: 'USA',
  websiteUrl: 'https://test-publishing.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as PublishingHouse;

describe('PublishingHouseCrudRepository', () => {
  let repository: PublishingHouseCrudRepository;
  let typeormRepo: Repository<PublishingHouse>;
  let auditLoggerService: IAuditLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishingHouseCrudRepository,
        {
          provide: getRepositoryToken(PublishingHouse),
          useValue: {
            create: jest.fn().mockReturnValue(mockPublishingHouse),
            save: jest.fn().mockResolvedValue(mockPublishingHouse),
            findOne: jest.fn().mockResolvedValue(mockPublishingHouse),
            update: jest.fn().mockResolvedValue({ affected: 1 }),
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
            findAndCount: jest.fn().mockResolvedValue([[mockPublishingHouse], 1]),
            count: jest.fn().mockResolvedValue(0),
          },
        },
        {
          provide: 'IAuditLoggerService',
          useValue: {
            log: jest.fn(),
          },
        }
      ],
    }).compile();

    repository = module.get<PublishingHouseCrudRepository>(PublishingHouseCrudRepository);
    typeormRepo = module.get<Repository<PublishingHouse>>(getRepositoryToken(PublishingHouse));
    auditLoggerService = module.get<IAuditLoggerService>('IAuditLoggerService');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('registerPublisher', () => {
    it('should register a publishing house', async () => {
      const createDto: CreatePublishingHouseDto = {
        name: 'Test Publishing House',
        country: 'USA',
        websiteUrl: 'https://test-publishing.com',
      } as CreatePublishingHouseDto;
      
      (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
      (repository as any)._create = jest.fn().mockResolvedValue(mockPublishingHouse);

      const result = await repository.registerPublisher(createDto, 'test-user');

      expect((repository as any)._validateUniqueConstraints).toHaveBeenCalled();
      expect((repository as any)._create).toHaveBeenCalled();
      expect(result).toEqual(mockPublishingHouse);
    });

    it('should throw error if name already exists', async () => {
      const createDto: CreatePublishingHouseDto = {
        name: 'Test Publishing House',
        country: 'USA',
        websiteUrl: 'https://test-publishing.com',
      } as CreatePublishingHouseDto;

      (repository as any)._validateUniqueConstraints = jest.fn()
        .mockRejectedValue(new HttpException('Publishing house name already exists', HttpStatus.CONFLICT));

      await expect(repository.registerPublisher(createDto, 'test-user')).rejects.toThrow(HttpException);
    });
  });

  describe('getPublisherProfile', () => {
    it('should return a publishing house profile', async () => {
      (repository as any)._findById = jest.fn().mockResolvedValue(mockPublishingHouse);

      const result = await repository.getPublisherProfile('1');

      expect((repository as any)._findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockPublishingHouse);
    });
  });

  describe('updatePublisherProfile', () => {
    it('should update a publishing house profile', async () => {
      const updateDto: UpdatePublishingHouseDto = { name: 'Updated Publishing House' };
      const updatedPublishingHouse = { ...mockPublishingHouse, ...updateDto };

      (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
      (repository as any)._update = jest.fn().mockResolvedValue(updatedPublishingHouse);

      const result = await repository.updatePublisherProfile('1', updateDto, 'test-user');

      expect((repository as any)._validateUniqueConstraints).toHaveBeenCalled();
      expect((repository as any)._update).toHaveBeenCalled();
      expect(result).toEqual(updatedPublishingHouse);
    });
  });

  describe('deactivatePublisher', () => {
    it('should deactivate a publishing house', async () => {
      const deleteResult = { id: '1' };
      (repository as any)._softDelete = jest.fn().mockResolvedValue(deleteResult);

      const result = await repository.deactivatePublisher('1', 'test-user');

      expect((repository as any)._softDelete).toHaveBeenCalledWith(
        '1',
        'test-user',
        'PublishingHouse',
        expect.any(Function)
      );
      expect(result).toEqual(deleteResult);
    });
  });

  describe('getAllPublishers', () => {
    it('should get all publishing houses', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockPublishingHouse], meta: { total: 1, page: 1, limit: 10 } };
      
      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.getAllPublishers(pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result).toEqual(paginatedResult);
    });
  });

});