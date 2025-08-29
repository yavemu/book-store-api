import { Test, TestingModule } from '@nestjs/testing';
import { PublishingHouseService } from '../publishing-house.service';
import { IPublishingHouseRepository } from '../../interfaces/publishing-house.repository.interface';
import { CreatePublishingHouseDto, UpdatePublishingHouseDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto';

describe('PublishingHouseService', () => {
    let service: PublishingHouseService;
    let repository: IPublishingHouseRepository;

    const mockPublishingHouseRepository = {
        registerPublisher: jest.fn(),
        getAllPublishers: jest.fn(),
        getPublisherProfile: jest.fn(),
        updatePublisherProfile: jest.fn(),
        deactivatePublisher: jest.fn(),
        searchPublishers: jest.fn(),
        getPublishersByCountry: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PublishingHouseService,
                {
                    provide: 'IPublishingHouseRepository',
                    useValue: mockPublishingHouseRepository,
                },
            ],
        }).compile();

        service = module.get<PublishingHouseService>(PublishingHouseService);
        repository = module.get<IPublishingHouseRepository>('IPublishingHouseRepository');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a publishing house', async () => {
            const createDto = new CreatePublishingHouseDto();
            await service.create(createDto, '1');
            expect(repository.registerPublisher).toHaveBeenCalledWith(createDto, '1');
        });
    });

    describe('findAll', () => {
        it('should find all publishing houses', async () => {
            const pagination = new PaginationDto();
            await service.findAll(pagination);
            expect(repository.getAllPublishers).toHaveBeenCalledWith(pagination);
        });
    });

    describe('findById', () => {
        it('should find a publishing house by id', async () => {
            await service.findById('1');
            expect(repository.getPublisherProfile).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a publishing house', async () => {
            const updateDto = new UpdatePublishingHouseDto();
            await service.update('1', updateDto, '1');
            expect(repository.updatePublisherProfile).toHaveBeenCalledWith('1', updateDto, '1');
        });
    });

    describe('softDelete', () => {
        it('should soft delete a publishing house', async () => {
            await service.softDelete('1', '1');
            expect(repository.deactivatePublisher).toHaveBeenCalledWith('1', '1');
        });
    });

    describe('search', () => {
        it('should search publishing houses', async () => {
            const pagination = new PaginationDto();
            await service.search('test', pagination);
            expect(repository.searchPublishers).toHaveBeenCalledWith('test', pagination);
        });
    });

    describe('findByCountry', () => {
        it('should find publishing houses by country', async () => {
            const pagination = new PaginationDto();
            await service.findByCountry('USA', pagination);
            expect(repository.getPublishersByCountry).toHaveBeenCalledWith('USA', pagination);
        });
    });
});
