import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../../../../common/enums/user-role.enum';
import { Response } from 'express';
import { InventoryMovementsController } from '../../inventory-movements.controller';
import { InventoryMovementCrudService } from '../../services/inventory-movement-crud.service';
import { PaginationDto } from '../../../../common/dto/pagination.dto';
import { FileExportService } from '../../../../common/services/file-export.service';
import {
  MovementFiltersDto,
  MovementSearchDto,
  MovementAdvancedFiltersDto,
  MovementCsvExportDto,
} from '../../dto';
import { MovementType } from '../../enums/movement-type.enum';
import { MovementStatus } from '../../enums/movement-status.enum';

describe('InventoryMovementsController', () => {
  let controller: InventoryMovementsController;
  let service: InventoryMovementCrudService;

  const mockService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    searchMovements: jest.fn(),
    exportMovementsCsv: jest.fn(),
  };

  const mockFileExportService = {
    generateDateBasedFilename: jest.fn(),
    exportToCsv: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryMovementsController],
      providers: [
        { provide: InventoryMovementCrudService, useValue: mockService },
        { provide: FileExportService, useValue: mockFileExportService },
      ],
    }).compile();

    controller = module.get<InventoryMovementsController>(InventoryMovementsController);
    service = module.get<InventoryMovementCrudService>(InventoryMovementCrudService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Swagger Decorators Validation', () => {
    it('getAllInventoryMovements should have ApiGetInventoryMovements decorator', () => {
      const metadata = Reflect.getMetadata(
        'swagger/apiOperation',
        controller.getAllInventoryMovements,
      );
      expect(metadata).toBeDefined();
      expect(metadata.summary).toContain('Acceso:');
    });

    it('getInventoryMovementById should have ApiGetInventoryMovementById decorator', () => {
      const metadata = Reflect.getMetadata(
        'swagger/apiOperation',
        controller.getInventoryMovementById,
      );
      expect(metadata).toBeDefined();
      expect(metadata.summary).toContain('Acceso:');
    });

    it('searchInventoryMovements should have ApiSearchInventoryMovements decorator', () => {
      const metadata = Reflect.getMetadata(
        'swagger/apiOperation',
        controller.searchInventoryMovements,
      );
      expect(metadata).toBeDefined();
      expect(metadata.summary).toContain('Acceso:');
    });

    it('exportMovementsCsv should have ApiExportInventoryMovementsCsv decorator', () => {
      const metadata = Reflect.getMetadata('swagger/apiOperation', controller.exportMovementsCsv);
      expect(metadata).toBeDefined();
      expect(metadata.summary).toContain('Acceso:');
    });
  });

  describe('getAllInventoryMovements', () => {
    it('should get all movements with pagination', async () => {
      const pagination = new PaginationDto();
      const req = { user: { userId: 'user-1', role: { name: UserRole.ADMIN } } };
      const mockResult = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockService.findAll.mockResolvedValue(mockResult);

      const result = await controller.getAllInventoryMovements(pagination, req);

      expect(result.data).toEqual(mockResult);
      expect(result.message).toBe('Movimientos de inventario obtenidos exitosamente');
      expect(service.findAll).toHaveBeenCalledWith(pagination, 'user-1', UserRole.ADMIN);
    });
  });

  describe('getInventoryMovementById', () => {
    it('should get movement by id', async () => {
      const id = 'movement-1';
      const req = { user: { userId: 'user-1', role: { name: UserRole.ADMIN } } };
      const mockMovement = { id, entityType: 'Book', movementType: MovementType.PURCHASE };

      mockService.findById.mockResolvedValue(mockMovement);

      const result = await controller.getInventoryMovementById(id, req);

      expect(result.data).toEqual(mockMovement);
      expect(result.message).toBe('Movimiento de inventario obtenido exitosamente');
      expect(service.findById).toHaveBeenCalledWith(id, 'user-1', UserRole.ADMIN);
    });
  });

  describe('searchInventoryMovements', () => {
    it('should search movements with filters and user context', async () => {
      const searchBody = {
        pagination: new PaginationDto(),
        filters: { movementType: MovementType.PURCHASE } as MovementFiltersDto,
        search: { searchTerm: 'test' } as MovementSearchDto,
        advancedFilters: { minPriceBefore: 10 } as MovementAdvancedFiltersDto,
      };
      const req = { user: { userId: 'user-1', role: { name: UserRole.USER } } };
      const mockResult = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0, hasNext: false, hasPrev: false },
      };

      mockService.searchMovements.mockResolvedValue(mockResult);

      const result = await controller.searchInventoryMovements(searchBody, req);

      expect(result.data).toEqual(mockResult);
      expect(result.message).toBe('Búsqueda de movimientos de inventario completada exitosamente');
      expect(service.searchMovements).toHaveBeenCalledWith(
        searchBody.pagination,
        searchBody.filters,
        searchBody.search,
        searchBody.advancedFilters,
        'user-1',
        UserRole.USER,
      );
    });
  });

  describe('exportMovementsCsv', () => {
    it('should export movements to CSV with mandatory filters', async () => {
      const exportBody = {
        filters: { movementType: MovementType.PURCHASE } as MovementFiltersDto,
        search: { searchTerm: 'test' } as MovementSearchDto,
      } as MovementCsvExportDto;
      const req = { user: { userId: 'user-1', role: { name: UserRole.ADMIN } } };
      const csvData = 'ID,Tipo,Estado\\nmovement-1,PURCHASE,COMPLETED';
      const mockResponse = {
        setHeader: jest.fn(),
        send: jest.fn(),
      } as unknown as Response;

      mockService.exportMovementsCsv.mockResolvedValue(csvData);

      await controller.exportMovementsCsv(exportBody, req, mockResponse);

      expect(service.exportMovementsCsv).toHaveBeenCalledWith(
        exportBody.filters,
        exportBody.search,
        undefined,
        'user-1',
        UserRole.ADMIN,
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename="movimientos-inventario.csv"',
      );
      expect(mockResponse.send).toHaveBeenCalledWith(csvData);
    });
  });
});
