import { Test, TestingModule } from '@nestjs/testing';
import { PublishingHousesController } from '../publishing-houses.controller';
import { IPublishingHouseService } from '../../interfaces/publishing-house.service.interface';
import { CreatePublishingHouseDto, UpdatePublishingHouseDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto/pagination.dto';

describe('PublishingHousesController', () => {
  let controller: PublishingHousesController;
  let publishingHouseService: IPublishingHouseService;

  const mockPublishingHouseService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    search: jest.fn(),
    findByCountry: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublishingHousesController],
      providers: [
        { provide: 'IPublishingHouseService', useValue: mockPublishingHouseService },
      ],
    }).compile();

    controller = module.get<PublishingHousesController>(PublishingHousesController);
    publishingHouseService = module.get<IPublishingHouseService>('IPublishingHouseService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a publishing house', async () => {
      const createDto = new CreatePublishingHouseDto();
      const req = { user: { id: 'user-1' } };
      
      await controller.create(createDto, req);
      
      expect(publishingHouseService.create).toHaveBeenCalledWith(createDto, 'user-1');
    });
  });

  describe('findAll', () => {
    it('should find all publishing houses', async () => {
      const pagination = new PaginationDto();
      
      await controller.findAll(pagination);
      
      expect(publishingHouseService.findAll).toHaveBeenCalledWith(pagination);
    });
  });

  describe('search', () => {
    it('should search publishing houses', async () => {
      const pagination = new PaginationDto();
      const searchTerm = 'test';
      
      await controller.search(searchTerm, pagination);
      
      expect(publishingHouseService.search).toHaveBeenCalledWith(searchTerm, pagination);
    });
  });

  describe('findByCountry', () => {
    it('should find publishing houses by country', async () => {
      const country = 'USA';
      const pagination = new PaginationDto();
      
      await controller.findByCountry(country, pagination);
      
      expect(publishingHouseService.findByCountry).toHaveBeenCalledWith(country, pagination);
    });
  });

  describe('findOne', () => {
    it('should find a publishing house by id', async () => {
      const id = '1';
      
      await controller.findOne(id);
      
      expect(publishingHouseService.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a publishing house', async () => {
      const id = '1';
      const updateDto = new UpdatePublishingHouseDto();
      const req = { user: { id: 'user-1' } };
      
      await controller.update(id, updateDto, req);
      
      expect(publishingHouseService.update).toHaveBeenCalledWith(id, updateDto, 'user-1');
    });
  });

  describe('remove', () => {
    it('should remove a publishing house', async () => {
      const id = '1';
      const req = { user: { id: 'user-1' } };
      
      await controller.remove(id, req);
      
      expect(publishingHouseService.softDelete).toHaveBeenCalledWith(id, 'user-1');
    });
  });
});