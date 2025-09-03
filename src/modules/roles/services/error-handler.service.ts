import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { IErrorHandlerService } from '../interfaces';

@Injectable()
export class ErrorHandlerService implements IErrorHandlerService {
  handleError(
    error: any,
    fallbackMessage: string,
    fallbackStatus: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ): never {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException(fallbackMessage, fallbackStatus);
  }

  createNotFoundException(message: string): never {
    throw new NotFoundException(message);
  }

  createConflictException(message: string): never {
    throw new ConflictException(message);
  }
}
