import { HttpStatus } from '@nestjs/common';

export interface IErrorHandlerService {
  handleError(error: any, fallbackMessage: string, fallbackStatus?: HttpStatus): never;
  createNotFoundException(message: string): never;
  createConflictException(message: string): never;
}
