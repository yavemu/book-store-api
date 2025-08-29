import { Test, TestingModule } from '@nestjs/testing';
import { PublishingHouseSearchService } from '../publishing-house-search.service';
import { IPublishingHouseSearchRepository } from '../../interfaces/publishing-house-search.repository.interface';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { PublishingHouse } from '../../entities/publishing-house.entity';

describe('PublishingHouseSearchService', () => {
  let service: PublishingHouseSearchService;
  let searchRepository: IPublishingHouseSearchRepository;

  const mockPublishingHouse: PublishingHouse = {
    id: '1',
    name: 'Test Publishing House',
    country: 'USA',
    websiteUrl: 'https://test-publishing.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as PublishingHouse;

  const mockSearchRepository = {
    searchPublishers: jest.fn(),
    getPublishersByCountry: jest.fn(),
    checkNameExists: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishingHouseSearchService,
        { provide: 'IPublishingHouseSearchRepository', useValue: mockSearchRepository },
      ],
    }).compile();

    service = module.get<PublishingHouseSearchService>(PublishingHouseSearchService);
    searchRepository = module.get<IPublishingHouseSearchRepository>('IPublishingHouseSearchRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should search publishing houses by term', async () => {
      const searchTerm = 'test';
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockPublishingHouse], meta: { total: 1, page: 1, limit: 10 } };
      mockSearchRepository.searchPublishers.mockResolvedValue(paginatedResult);

      const result = await service.search(searchTerm, pagination);

      expect(searchRepository.searchPublishers).toHaveBeenCalledWith(searchTerm, pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findByCountry', () => {
    it('should find publishing houses by country', async () => {
      const country = 'USA';
      const pagination = new PaginationDto();
      const paginatedResult = { data: [mockPublishingHouse], meta: { total: 1, page: 1, limit: 10 } };
      mockSearchRepository.getPublishersByCountry.mockResolvedValue(paginatedResult);

      const result = await service.findByCountry(country, pagination);

      expect(searchRepository.getPublishersByCountry).toHaveBeenCalledWith(country, pagination);
      expect(result).toEqual(paginatedResult);
    });
  });
});