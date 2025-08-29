import { Test, TestingModule } from '@nestjs/testing';
import { BookAuthorAssignmentsController } from '../book-author-assignments.controller';
import { IBookAuthorAssignmentService } from '../interfaces/book-author-assignment.service.interface';
import { CreateBookAuthorAssignmentDto, UpdateBookAuthorAssignmentDto } from '../dto';
import { PaginationDto } from '../../../common/dto';

describe('BookAuthorAssignmentsController', () => {
    let controller: BookAuthorAssignmentsController;
    let service: IBookAuthorAssignmentService;

    const mockBookAuthorAssignmentService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findByBook: jest.fn(),
        findByAuthor: jest.fn(),
        checkAssignmentExists: jest.fn(),
        findById: jest.fn(),
        update: jest.fn(),
        softDelete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [BookAuthorAssignmentsController],
            providers: [
                {
                    provide: 'IBookAuthorAssignmentService',
                    useValue: mockBookAuthorAssignmentService,
                },
            ],
        }).compile();

        controller = module.get<BookAuthorAssignmentsController>(BookAuthorAssignmentsController);
        service = module.get<IBookAuthorAssignmentService>('IBookAuthorAssignmentService');
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a book author assignment', async () => {
            const createDto = new CreateBookAuthorAssignmentDto();
            const req = { user: { id: '1' } };
            await controller.create(createDto, req);
            expect(service.create).toHaveBeenCalledWith(createDto, '1');
        });
    });

    describe('findAll', () => {
        it('should find all book author assignments', async () => {
            const pagination = new PaginationDto();
            await controller.findAll(pagination);
            expect(service.findAll).toHaveBeenCalledWith(pagination);
        });
    });

    describe('findByBook', () => {
        it('should find book author assignments by book', async () => {
            const pagination = new PaginationDto();
            await controller.findByBook('1', pagination);
            expect(service.findByBook).toHaveBeenCalledWith('1', pagination);
        });
    });

    describe('findByAuthor', () => {
        it('should find book author assignments by author', async () => {
            const pagination = new PaginationDto();
            await controller.findByAuthor('1', pagination);
            expect(service.findByAuthor).toHaveBeenCalledWith('1', pagination);
        });
    });

    describe('checkAssignment', () => {
        it('should check if assignment exists', async () => {
            await controller.checkAssignment('1', '2');
            expect(service.checkAssignmentExists).toHaveBeenCalledWith('1', '2');
        });
    });

    describe('findOne', () => {
        it('should find a book author assignment by id', async () => {
            await controller.findOne('1');
            expect(service.findById).toHaveBeenCalledWith('1');
        });
    });

    describe('update', () => {
        it('should update a book author assignment', async () => {
            const updateDto = new UpdateBookAuthorAssignmentDto();
            const req = { user: { id: '1' } };
            await controller.update('1', updateDto, req);
            expect(service.update).toHaveBeenCalledWith('1', updateDto, '1');
        });
    });

    describe('remove', () => {
        it('should remove a book author assignment', async () => {
            const req = { user: { id: '1' } };
            await controller.remove('1', req);
            expect(service.softDelete).toHaveBeenCalledWith('1', '1');
        });
    });
});
