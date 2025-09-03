import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookAuthorAssignment } from './entities/book-author-assignment.entity';
import { BookAuthorAssignmentsController } from './book-author-assignments.controller';
import { BookAuthorAssignmentService } from './services/book-author-assignment.service';
import { BookAuthorAssignmentCrudService } from './services/book-author-assignment-crud.service';
import { BookAuthorAssignmentSearchService } from './services/book-author-assignment-search.service';
import { ValidationService } from './services/validation.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { UserContextService } from './services/user-context.service';
import { BookAuthorAssignmentCrudRepository } from './repositories/book-author-assignments-crud.repository';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookAuthorAssignment]), AuditModule],
  controllers: [BookAuthorAssignmentsController],
  providers: [
    // Core Services
    BookAuthorAssignmentService,
    BookAuthorAssignmentCrudService,
    BookAuthorAssignmentSearchService,
    ValidationService,
    ErrorHandlerService,
    UserContextService,
    BookAuthorAssignmentCrudRepository,

    // Interface Providers
    {
      provide: 'IBookAuthorAssignmentService',
      useClass: BookAuthorAssignmentService,
    },
    {
      provide: 'IBookAuthorAssignmentCrudService',
      useClass: BookAuthorAssignmentCrudService,
    },
    {
      provide: 'IBookAuthorAssignmentSearchService',
      useClass: BookAuthorAssignmentSearchService,
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
      provide: 'IBookAuthorAssignmentRepository',
      useClass: BookAuthorAssignmentCrudRepository,
    },
    {
      provide: 'IBookAuthorAssignmentCrudRepository',
      useClass: BookAuthorAssignmentCrudRepository,
    },
    {
      provide: 'IBookAuthorAssignmentSearchRepository',
      useClass: BookAuthorAssignmentCrudRepository,
    },
    {
      provide: 'IBookAuthorAssignmentValidationRepository',
      useClass: BookAuthorAssignmentCrudRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    BookAuthorAssignmentService,
    BookAuthorAssignmentCrudService,
    BookAuthorAssignmentSearchService,
    BookAuthorAssignmentCrudRepository,
  ],
})
export class BookAuthorAssignmentsModule {}
