import { Test, TestingModule } from '@nestjs/testing';
import { PublishingHousesController } from '../publishing-houses.controller';
import { IPublishingHouseService } from '../interfaces/publishing-house.service.interface';
import { CreatePublishingHouseDto, UpdatePublishingHouseDto } from '../dto';
import { PaginationDto } from '../../../common/dto';

describe('PublishingHousesController', () => {
    let controller: PublishingHousesController;
    let service: IPublishingHouseService;

    const mockPublishingHouseService = {
        create: jest.fn(),
        findAll: jest.fn(),
        search: jest.fn(),
        findByCountry: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PublishingHousesController],
            providers: [
                {
                    provide: 'IPublishingHouseService',
                    useValue: mockPublishingHouseService,
                },
            ],
        }).compile();

        controller = module.get<PublishingHousesController>(PublishingHousesController);
        service = module.get<IPublishingHouseService>('IPublishingHouseService');
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a publishing house', async () => {
            const createDto = new CreatePublishingHouseDto();
            const req = { user: { id: '1' } };
            await controller.create(createDto, req);
            expect(service.create).toHaveBeenCalledWith(createDto, '1');
        });
    });

    describe('findAll', () => {
        it('should find all publishing houses', async () => {
            const pagination = new PaginationDto();
            await controller.findAll(pagination);
            expect(service.findAll).toHaveBeenCalledWith(pagination);
        });
    });

    describe('search', () => {
        it('should search publishing houses', async () => {
            const pagination = new PaginationDto();
            await controller.search('test', pagination);
            expect(service.search).toHaveBeenCalledWith('test', pagination);
        });
    });

    describe('findByCountry', () => {
        it('should find publishing houses by country', async () => {
            const pagination = new PaginationDto();
            await controller.findByCountry('USA', pagination);
            expect(service.findByCountry).toHaveBeenCalledWith('USA', pagination);
        });
    });

    describe('findOne', () => {
        it('should find a publishing house by id', async () => {
            await controller.findOne('1');
            expect(service.findById).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a publishing house', async () => {
            const updateDto = new UpdatePublishingHouseDto();
            const req = { user: { id: '1' } };
            await controller.update('1', updateDto, req);
            expect(service.update).toHaveBeenCalledWith('1', updateDto, '1');
        });
    });

    describe('remove', () => {
        it('should remove a publishing house', async () => {
            const req = { user: { id: '1' } };
            await controller.remove('1', req);
            expect(service.softDelete).toHaveBeenCalledWith('1', '1');
        });
    });
});
