import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublishingHouseSearchRepository } from '../publishing-house-search.repository';
import { PublishingHouse } from '../../entities/publishing-house.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

const mockPublishingHouse: PublishingHouse = {
  id: '1',
  name: 'Test Publishing House',
  country: 'USA',
  websiteUrl: 'https://test-publishing.com',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
} as PublishingHouse;

describe('PublishingHouseSearchRepository', () => {
  let repository: PublishingHouseSearchRepository;
  let typeormRepo: Repository<PublishingHouse>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishingHouseSearchRepository,
        {
          provide: getRepositoryToken(PublishingHouse),
          useValue: {
            count: jest.fn().mockResolvedValue(0),
            createQueryBuilder: jest.fn().mockReturnValue({
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockResolvedValue([[mockPublishingHouse], 1]),
            }),
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

    repository = module.get<PublishingHouseSearchRepository>(PublishingHouseSearchRepository);
    typeormRepo = module.get<Repository<PublishingHouse>>(getRepositoryToken(PublishingHouse));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('searchPublishers', () => {
    it('should search publishing houses by term', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockPublishingHouse], meta: { total: 1, page: 1, limit: 10 } };
      
      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.searchPublishers('test', pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result.data).toEqual([mockPublishingHouse]);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('getPublishersByCountry', () => {
    it('should get publishing houses by country', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockPublishingHouse], meta: { total: 1, page: 1, limit: 10 } };
      
      (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue(paginatedResult);

      const result = await repository.getPublishersByCountry('USA', pagination);

      expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
      expect(result.data).toEqual([mockPublishingHouse]);
    });
  });

  describe('checkNameExists', () => {
    it('should check if name exists and return true', async () => {
      (typeormRepo.count as jest.Mock).mockResolvedValue(1);

      const result = await repository.checkNameExists('Test Publishing House');

      expect(typeormRepo.count).toHaveBeenCalledWith({
        where: { name: 'Test Publishing House' }
      });
      expect(result).toBe(true);
    });

    it('should check if name exists and return false', async () => {
      (typeormRepo.count as jest.Mock).mockResolvedValue(0);

      const result = await repository.checkNameExists('Nonexistent Publishing House');

      expect(typeormRepo.count).toHaveBeenCalledWith({
        where: { name: 'Nonexistent Publishing House' }
      });
      expect(result).toBe(false);
    });
  });
});