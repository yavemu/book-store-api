import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserRole } from '../enums/user-role.enum';
import { ForbiddenException } from '@nestjs/common';
import { PaginationDto } from '../../../common/dto';

const mockUser = {
    id: '1',
    username: 'test',
    role: UserRole.USER,
};

const mockAdmin = {
    id: '2',
    username: 'admin',
    role: UserRole.ADMIN,
    userId: '2',
};

describe('UsersController', () => {
    let controller: UsersController;
    let service: UserService;

    const mockUserService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
            ],
        }).compile();

        controller = module.get<UsersController>(UsersController);
        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto: CreateUserDto = {} as any;
            await controller.create(createUserDto, { user: mockAdmin });
            expect(service.create).toHaveBeenCalledWith(createUserDto, mockAdmin.id);
        });
    });

    describe('findAll', () => {
        it('should find all users', async () => {
            const pagination = new PaginationDto();
            await controller.findAll(pagination);
            expect(service.findAll).toHaveBeenCalledWith(pagination);
        });
    });

    describe('findOne', () => {
        it('should find a user by id', async () => {
            await controller.findOne('1', { user: mockAdmin });
            expect(service.findById).toHaveBeenCalledWith('1');
        });

        it('should allow user to view their own profile', async () => {
            await controller.findOne('1', { user: { ...mockUser, userId: '1' } });
            expect(service.findById).toHaveBeenCalledWith('1');
        });

        it('should throw forbidden exception if user tries to view another profile', async () => {
            await expect(controller.findOne('2', { user: { ...mockUser, userId: '1' } })).rejects.toThrow(ForbiddenException);
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto: UpdateUserDto = {} as any;
            await controller.update('1', updateUserDto, { user: mockAdmin });
            expect(service.update).toHaveBeenCalledWith('1', updateUserDto, mockAdmin.id);
        });

        it('should allow user to update their own profile', async () => {
            const updateUserDto: UpdateUserDto = {} as any;
            await controller.update('1', updateUserDto, { user: { ...mockUser, userId: '1' } });
            expect(service.update).toHaveBeenCalledWith('1', updateUserDto, '1');
        });

        it('should throw forbidden exception if user tries to update another profile', async () => {
            const updateUserDto: UpdateUserDto = {} as any;
            await expect(controller.update('2', updateUserDto, { user: { ...mockUser, userId: '1' } })).rejects.toThrow(ForbiddenException);
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            await controller.remove('1');
            expect(service.softDelete).toHaveBeenCalledWith('1');
        });
    });
});
