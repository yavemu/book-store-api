import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus, NotFoundException, ConflictException } from '@nestjs/common';
import { ErrorHandlerService } from '../error-handler.service';

describe('BookCatalogErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorHandlerService],
    }).compile();

    service = module.get<ErrorHandlerService>(ErrorHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleError', () => {
    it('should re-throw HttpException if error is already an HttpException', () => {
      const httpError = new HttpException('Test error', HttpStatus.BAD_REQUEST);

      expect(() => {
        service.handleError(httpError, 'Fallback message');
      }).toThrow(httpError);
    });

    it('should throw HttpException with fallback message and default status for non-HttpException errors', () => {
      const genericError = new Error('Generic error');
      const fallbackMessage = 'Something went wrong';

      expect(() => {
        service.handleError(genericError, fallbackMessage);
      }).toThrow(new HttpException(fallbackMessage, HttpStatus.INTERNAL_SERVER_ERROR));
    });

    it('should throw HttpException with fallback message and custom status', () => {
      const genericError = new Error('Generic error');
      const fallbackMessage = 'Custom error message';
      const customStatus = HttpStatus.BAD_REQUEST;

      expect(() => {
        service.handleError(genericError, fallbackMessage, customStatus);
      }).toThrow(new HttpException(fallbackMessage, customStatus));
    });

    it('should handle null/undefined errors', () => {
      const fallbackMessage = 'Fallback for null error';

      expect(() => {
        service.handleError(null, fallbackMessage);
      }).toThrow(new HttpException(fallbackMessage, HttpStatus.INTERNAL_SERVER_ERROR));

      expect(() => {
        service.handleError(undefined, fallbackMessage);
      }).toThrow(new HttpException(fallbackMessage, HttpStatus.INTERNAL_SERVER_ERROR));
    });

    it('should handle string errors', () => {
      const stringError = 'String error';
      const fallbackMessage = 'Fallback message';

      expect(() => {
        service.handleError(stringError, fallbackMessage);
      }).toThrow(new HttpException(fallbackMessage, HttpStatus.INTERNAL_SERVER_ERROR));
    });
  });

  describe('createNotFoundException', () => {
    it('should throw NotFoundException with provided message', () => {
      const message = 'Resource not found';

      expect(() => {
        service.createNotFoundException(message);
      }).toThrow(new NotFoundException(message));
    });

    it('should throw NotFoundException with correct status code', () => {
      const message = 'Not found test';

      try {
        service.createNotFoundException(message);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(error.message).toBe(message);
      }
    });
  });

  describe('createConflictException', () => {
    it('should throw ConflictException with provided message', () => {
      const message = 'Resource conflict';

      expect(() => {
        service.createConflictException(message);
      }).toThrow(new ConflictException(message));
    });

    it('should throw ConflictException with correct status code', () => {
      const message = 'Conflict test';

      try {
        service.createConflictException(message);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.getStatus()).toBe(HttpStatus.CONFLICT);
        expect(error.message).toBe(message);
      }
    });
  });
});