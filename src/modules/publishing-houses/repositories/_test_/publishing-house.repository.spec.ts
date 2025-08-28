import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublishingHouseRepository } from '../publishing-house.repository';
import { PublishingHouse } from '../../entities/publishing-house.entity';
import { CreatePublishingHouseDto, UpdatePublishingHouseDto } from '../../dto';
import { PaginationDto } from '../../../../common/dto';
import { ConflictException, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

const mockPublishingHouse: PublishingHouse = {
    id: '1',
    name: 'Test Publisher',
    country: 'USA',
    websiteUrl: 'www.test.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
};

describe('PublishingHouseRepository', () => {
    let repository: PublishingHouseRepository;
    let publisherRepo: Repository<PublishingHouse>;

    const mockPublisherRepo = {
        findOne: jest.fn(),
        create: jest.fn().mockReturnValue(mockPublishingHouse),
        save: jest.fn().mockResolvedValue(mockPublishingHouse),
        softDelete: jest.fn(),
        update: jest.fn(),
        findAndCount: jest.fn(),
        count: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PublishingHouseRepository,
                {
                    provide: getRepositoryToken(PublishingHouse),
                    useValue: mockPublisherRepo,
                },
                {
                    provide: 'IAuditLogService',
                    useValue: {},
                }
            ],
        }).compile();

        repository = module.get<PublishingHouseRepository>(PublishingHouseRepository);
        publisherRepo = module.get<Repository<PublishingHouse>>(getRepositoryToken(PublishingHouse));
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(repository).toBeDefined();
    });

    describe('registerPublisher', () => {
        it('should register a publisher', async () => {
            (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
            (repository as any)._createEntity = jest.fn().mockResolvedValue(mockPublishingHouse);
            const createDto = new CreatePublishingHouseDto();
            const result = await repository.registerPublisher(createDto);
            expect(result).toEqual(mockPublishingHouse);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._validateUniqueConstraints = jest.fn().mockRejectedValue(new Error());
            const createDto = new CreatePublishingHouseDto();
            await expect(repository.registerPublisher(createDto)).rejects.toThrow(HttpException);
        });
    });

    describe('getPublisherProfile', () => {
        it('should return a publisher profile', async () => {
            (repository as any)._findById = jest.fn().mockResolvedValue(mockPublishingHouse);
            const result = await repository.getPublisherProfile('1');
            expect(result).toEqual(mockPublishingHouse);
        });

        it('should throw not found exception if publisher does not exist', async () => {
            (repository as any)._findById = jest.fn().mockResolvedValue(null);
            await expect(repository.getPublisherProfile('1')).rejects.toThrow(NotFoundException);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._findById = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getPublisherProfile('1')).rejects.toThrow(HttpException);
        });
    });

    describe('updatePublisherProfile', () => {
        it('should update a publisher profile', async () => {
            const updateDto = new UpdatePublishingHouseDto();
            (repository as any).getPublisherProfile = jest.fn().mockResolvedValue(mockPublishingHouse);
            (repository as any)._validateUniqueConstraints = jest.fn().mockResolvedValue(undefined);
            (repository as any)._updateEntity = jest.fn();
            (repository as any)._findById = jest.fn().mockResolvedValue({ ...mockPublishingHouse, ...updateDto });

            const result = await repository.updatePublisherProfile('1', updateDto);
            expect(result).toBeDefined();
        });

        it('should throw http exception on error', async () => {
            const updateDto = new UpdatePublishingHouseDto();
            (repository as any).getPublisherProfile = jest.fn().mockRejectedValue(new Error());
            await expect(repository.updatePublisherProfile('1', updateDto)).rejects.toThrow(HttpException);
        });
    });

    describe('deactivatePublisher', () => {
        it('should deactivate a publisher', async () => {
            (repository as any).getPublisherProfile = jest.fn().mockResolvedValue(mockPublishingHouse);
            (repository as any)._softDelete = jest.fn();
            await repository.deactivatePublisher('1');
            expect((repository as any)._softDelete).toHaveBeenCalledWith('1');
        });

        it('should throw http exception on error', async () => {
            (repository as any).getPublisherProfile = jest.fn().mockRejectedValue(new Error());
            await expect(repository.deactivatePublisher('1')).rejects.toThrow(HttpException);
        });
    });

    describe('searchPublishers', () => {
        it('should search publishers', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.searchPublishers('test', pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.searchPublishers('test', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getAllPublishers', () => {
        it('should get all publishers', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getAllPublishers(pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getAllPublishers(pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('getPublishersByCountry', () => {
        it('should get publishers by country', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockResolvedValue([[], 0]);
            await repository.getPublishersByCountry('USA', pagination);
            expect((repository as any)._findManyWithPagination).toHaveBeenCalled();
        });

        it('should throw http exception on error', async () => {
            const pagination = new PaginationDto();
            (repository as any)._findManyWithPagination = jest.fn().mockRejectedValue(new Error());
            await expect(repository.getPublishersByCountry('USA', pagination)).rejects.toThrow(HttpException);
        });
    });

    describe('checknameExists', () => {
        it('should check if name exists', async () => {
            (repository as any)._exists = jest.fn().mockResolvedValue(true);
            const result = await repository.checknameExists('test');
            expect(result).toBe(true);
        });

        it('should throw http exception on error', async () => {
            (repository as any)._exists = jest.fn().mockRejectedValue(new Error());
            await expect(repository.checknameExists('test')).rejects.toThrow(HttpException);
        });
    });
});
