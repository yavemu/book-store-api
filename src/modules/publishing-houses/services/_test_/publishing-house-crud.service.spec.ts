import { Test, TestingModule } from '@nestjs/testing';
import { PublishingHouseCrudService } from '../publishing-house-crud.service';
import { IPublishingHouseCrudRepository } from '../../interfaces/publishing-house-crud.repository.interface';
import { CreatePublishingHouseDto } from '../../dto/create-publishing-house.dto';
import { UpdatePublishingHouseDto } from '../../dto/update-publishing-house.dto';
import { PublishingHouse } from '../../entities/publishing-house.entity';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

describe('PublishingHouseCrudService', () => {
  let service: PublishingHouseCrudService;
  let mockCrudRepository: jest.Mocked<IPublishingHouseCrudRepository>;

  const mockPublishingHouse: PublishingHouse = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Penguin Random House',
    country: 'United States',
    websiteUrl: 'https://www.penguinrandomhouse.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockPublishingHouses: PublishingHouse[] = [
    mockPublishingHouse,
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      name: 'HarperCollins',
      country: 'United Kingdom',
      websiteUrl: 'https://www.harpercollins.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  const mockPaginatedResult = {
    data: mockPublishingHouses,
    meta: {
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };

  const createDto: CreatePublishingHouseDto = {
    name: 'Penguin Random House',
    country: 'United States',
    websiteUrl: 'https://www.penguinrandomhouse.com',
  };

  const updateDto: UpdatePublishingHouseDto = {
    websiteUrl: 'https://www.updated-website.com',
  };

  const createPagination = (): PaginationDto => {
    const paginationDto = new PaginationDto();
    paginationDto.page = 1;
    paginationDto.limit = 10;
    paginationDto.sortBy = 'createdAt';
    paginationDto.sortOrder = 'DESC';
    return paginationDto;
  };
  const pagination = createPagination();

  beforeEach(async () => {
    mockCrudRepository = {
      registerPublisher: jest.fn(),
      getAllPublishers: jest.fn(),
      getPublisherProfile: jest.fn(),
      updatePublisherProfile: jest.fn(),
      deactivatePublisher: jest.fn(),
      findForSelect: jest.fn().mockResolvedValue(mockPublishingHouses),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublishingHouseCrudService,
        {
          provide: 'IPublishingHouseCrudRepository',
          useValue: mockCrudRepository,
        },
      ],
    }).compile();

    service = module.get<PublishingHouseCrudService>(PublishingHouseCrudService);
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('create()', () => {
    it('should create a new publishing house successfully', async () => {
      mockCrudRepository.registerPublisher.mockResolvedValue(mockPublishingHouse);

      const result = await service.create(createDto, 'user123');

      expect(result).toEqual(mockPublishingHouse);
      expect(mockCrudRepository.registerPublisher).toHaveBeenCalledWith(createDto, 'user123');
    });

    it('should handle repository errors during creation', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.registerPublisher.mockRejectedValue(repositoryError);

      await expect(service.create(createDto, 'user123')).rejects.toThrow('Database error');
    });
  });

  describe('findAll()', () => {
    it('should return paginated publishing houses list', async () => {
      mockCrudRepository.getAllPublishers.mockResolvedValue(mockPaginatedResult);

      const result = await service.findAll(pagination);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockCrudRepository.getAllPublishers).toHaveBeenCalledWith(pagination);
    });

    it('should handle empty results', async () => {
      const emptyResult = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
      mockCrudRepository.getAllPublishers.mockResolvedValue(emptyResult);

      const result = await service.findAll(pagination);

      expect(result.data).toHaveLength(0);
      expect(result.meta.total).toBe(0);
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database connection error');
      mockCrudRepository.getAllPublishers.mockRejectedValue(repositoryError);

      await expect(service.findAll(pagination)).rejects.toThrow('Database connection error');
    });
  });

  describe('findById()', () => {
    it('should return a publishing house by ID', async () => {
      mockCrudRepository.getPublisherProfile.mockResolvedValue(mockPublishingHouse);

      const result = await service.findById(mockPublishingHouse.id);

      expect(result).toEqual(mockPublishingHouse);
      expect(mockCrudRepository.getPublisherProfile).toHaveBeenCalledWith(mockPublishingHouse.id);
    });

    it('should handle repository errors', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.getPublisherProfile.mockRejectedValue(repositoryError);

      await expect(service.findById(mockPublishingHouse.id)).rejects.toThrow('Database error');
    });
  });

  describe('update()', () => {
    it('should update a publishing house successfully', async () => {
      const updatedPublishingHouse = { ...mockPublishingHouse, ...updateDto };
      mockCrudRepository.updatePublisherProfile.mockResolvedValue(updatedPublishingHouse);

      const result = await service.update(mockPublishingHouse.id, updateDto, 'user123');

      expect(result).toEqual(updatedPublishingHouse);
      expect(mockCrudRepository.updatePublisherProfile).toHaveBeenCalledWith(
        mockPublishingHouse.id,
        updateDto,
        'user123',
      );
    });

    it('should handle repository errors during update', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.updatePublisherProfile.mockRejectedValue(repositoryError);

      await expect(service.update(mockPublishingHouse.id, updateDto, 'user123')).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('softDelete()', () => {
    it('should soft delete a publishing house successfully', async () => {
      const deleteResult = { id: mockPublishingHouse.id };
      mockCrudRepository.deactivatePublisher.mockResolvedValue(deleteResult);

      const result = await service.softDelete(mockPublishingHouse.id, 'user123');

      expect(result).toEqual(deleteResult);
      expect(mockCrudRepository.deactivatePublisher).toHaveBeenCalledWith(
        mockPublishingHouse.id,
        'user123',
      );
    });

    it('should handle repository errors during deletion', async () => {
      const repositoryError = new Error('Database error');
      mockCrudRepository.deactivatePublisher.mockRejectedValue(repositoryError);

      await expect(service.softDelete(mockPublishingHouse.id, 'user123')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
