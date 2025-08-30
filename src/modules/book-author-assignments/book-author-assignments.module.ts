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
import { BookAuthorAssignmentRepository } from './repositories/book-author-assignment.repository';
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
    BookAuthorAssignmentRepository,

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
      useClass: BookAuthorAssignmentRepository,
    },
    {
      provide: 'IBookAuthorAssignmentCrudRepository',
      useClass: BookAuthorAssignmentRepository,
    },
    {
      provide: 'IBookAuthorAssignmentSearchRepository',
      useClass: BookAuthorAssignmentRepository,
    },
    {
      provide: 'IBookAuthorAssignmentValidationRepository',
      useClass: BookAuthorAssignmentRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    BookAuthorAssignmentService,
    BookAuthorAssignmentCrudService,
    BookAuthorAssignmentSearchService,
    BookAuthorAssignmentRepository,
  ],
})
export class BookAuthorAssignmentsModule {}
