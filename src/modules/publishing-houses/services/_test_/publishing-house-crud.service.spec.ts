import { Test, TestingModule } from '@nestjs/testing';
import { PublishingHouseCrudService } from '../publishing-house-crud.service';
import { IPublishingHouseCrudRepository } from '../../interfaces/publishing-house-crud.repository.interface';
import { CreatePublishingHouseDto, UpdatePublishingHouseDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { PublishingHouse } from '../../entities/publishing-house.entity';

describe('PublishingHouseCrudService', () => {
  let service: PublishingHouseCrudService;
  let crudRepository: IPublishingHouseCrudRepository;

  const mockPublishingHouse: PublishingHouse = {
    id: '1',
    name: 'Test Publishing House',
    country: 'USA',
    websiteUrl: 'https://test-publishing.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as PublishingHouse;

  const mockCrudRepository = {
    registerPublisher: jest.fn(),
    getAllPublishers: jest.fn(),
    getPublisherProfile: jest.fn(),
    updatePublisherProfile: jest.fn(),
    deactivatePublisher: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishingHouseCrudService,
        { provide: 'IPublishingHouseCrudRepository', useValue: mockCrudRepository },
      ],
    }).compile();

    service = module.get<PublishingHouseCrudService>(PublishingHouseCrudService);
    crudRepository = module.get<IPublishingHouseCrudRepository>('IPublishingHouseCrudRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a publishing house', async () => {
      const createDto = new CreatePublishingHouseDto();
      const performedBy = 'user-1';
      mockCrudRepository.registerPublisher.mockResolvedValue(mockPublishingHouse);

      const result = await service.create(createDto, performedBy);

      expect(crudRepository.registerPublisher).toHaveBeenCalledWith(createDto, performedBy);
      expect(result).toEqual(mockPublishingHouse);
    });
  });

  describe('findAll', () => {
    it('should find all publishing houses', async () => {
      const pagination = new PaginationDto();
      const paginatedResult = {
        data: [mockPublishingHouse],
        meta: { total: 1, page: 1, limit: 10 },
      };
      mockCrudRepository.getAllPublishers.mockResolvedValue(paginatedResult);

      const result = await service.findAll(pagination);

      expect(crudRepository.getAllPublishers).toHaveBeenCalledWith(pagination);
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('findById', () => {
    it('should find a publishing house by id', async () => {
      const id = '1';
      mockCrudRepository.getPublisherProfile.mockResolvedValue(mockPublishingHouse);

      const result = await service.findById(id);

      expect(crudRepository.getPublisherProfile).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockPublishingHouse);
    });
  });

  describe('update', () => {
    it('should update a publishing house', async () => {
      const id = '1';
      const updateDto = new UpdatePublishingHouseDto();
      const performedBy = 'user-1';
      const updatedPublishingHouse = { ...mockPublishingHouse, ...updateDto };
      mockCrudRepository.updatePublisherProfile.mockResolvedValue(updatedPublishingHouse);

      const result = await service.update(id, updateDto, performedBy);

      expect(crudRepository.updatePublisherProfile).toHaveBeenCalledWith(
        id,
        updateDto,
        performedBy,
      );
      expect(result).toEqual(updatedPublishingHouse);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a publishing house', async () => {
      const id = '1';
      const performedBy = 'user-1';
      const deleteResult = { id: '1' };
      mockCrudRepository.deactivatePublisher.mockResolvedValue(deleteResult);

      const result = await service.softDelete(id, performedBy);

      expect(crudRepository.deactivatePublisher).toHaveBeenCalledWith(id, performedBy);
      expect(result).toEqual(deleteResult);
    });
  });
});
