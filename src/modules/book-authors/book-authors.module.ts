import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookAuthor } from './entities/book-author.entity';
import { BookAuthorsController } from './book-authors.controller';
import { BookAuthorCrudService } from './services/book-author-crud.service';
import { BookAuthorSearchService } from './services/book-author-search.service';
import { ValidationService } from './services/validation.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { UserContextService } from './services/user-context.service';
import { BookAuthorRepository } from './repositories/book-author.repository';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookAuthor]), AuditModule],
  controllers: [BookAuthorsController],
  providers: [
    // Core Services
    BookAuthorCrudService,
    BookAuthorSearchService,
    ValidationService,
    ErrorHandlerService,
    UserContextService,
    BookAuthorRepository,

    // Interface Providers
    {
      provide: 'IBookAuthorCrudService',
      useClass: BookAuthorCrudService,
    },
    {
      provide: 'IBookAuthorSearchService',
      useClass: BookAuthorSearchService,
    },
    {
      provide: 'IValidationService',
      useClass: ValidationService,
    },
    {
      provide: 'IErrorHandlerService',
      useClass: ErrorHandlerService,
    },
    {
      provide: 'IUserContextService',
      useClass: UserContextService,
    },
    {
      provide: 'IBookAuthorCrudRepository',
      useClass: BookAuthorRepository,
    },
    {
      provide: 'IBookAuthorSearchRepository',
      useClass: BookAuthorRepository,
    },
    {
      provide: 'IBookAuthorValidationRepository',
      useClass: BookAuthorRepository,
    },
  ],
  exports: [TypeOrmModule, BookAuthorCrudService, BookAuthorSearchService, BookAuthorRepository],
})
export class BookAuthorsModule {}
