import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const mockHealthResponse = {
        status: 'ok',
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 123.456,
      };

      jest.spyOn(service, 'getHealth').mockReturnValue(mockHealthResponse);

      const result = controller.getHealth();

      expect(result).toEqual(mockHealthResponse);
      expect(service.getHealth).toHaveBeenCalled();
    });

    it('should call appService.getHealth', () => {
      const spy = jest.spyOn(service, 'getHealth');
      controller.getHealth();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});