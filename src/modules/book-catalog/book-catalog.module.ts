import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCatalog } from './entities/book-catalog.entity';
import { BookCatalogController } from './controllers/book-catalog.controller';
import { BookCatalogCrudService } from './services/book-catalog-crud.service';
import { BookCatalogSearchService } from './services/book-catalog-search.service';
import { ValidationService } from './services/validation.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { UserContextService } from './services/user-context.service';
import { BookCatalogCrudRepository } from './repositories/book-catalog-crud.repository';
import { BookCatalogSearchRepository } from './repositories/book-catalog-search.repository';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookCatalog]),
    AuditModule,
  ],
  controllers: [BookCatalogController],
  providers: [
    // Core Services
    BookCatalogCrudService,
    BookCatalogSearchService,
    ValidationService,
    ErrorHandlerService,
    UserContextService,
    BookCatalogCrudRepository,
    BookCatalogSearchRepository,
    
    // Interface Providers
    {
      provide: 'IBookCatalogCrudService',
      useClass: BookCatalogCrudService,
    },
    {
      provide: 'IBookCatalogSearchService',
      useClass: BookCatalogSearchService,
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
      provide: 'IBookCatalogCrudRepository',
      useClass: BookCatalogCrudRepository,
    },
    {
      provide: 'IBookCatalogSearchRepository',
      useClass: BookCatalogSearchRepository,
    },
    {
      provide: 'IBookCatalogValidationRepository',
      useClass: BookCatalogCrudRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    BookCatalogCrudService,
    BookCatalogSearchService,
    BookCatalogCrudRepository,
    BookCatalogSearchRepository,
  ],
})
export class BookCatalogModule {}