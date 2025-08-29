import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookGenre } from './entities/book-genre.entity';
import { BookGenreCrudRepository } from './repositories/book-genre-crud.repository';
import { BookGenreSearchRepository } from './repositories/book-genre-search.repository';
import { BookGenreCrudService } from './services/book-genre-crud.service';
import { BookGenreSearchService } from './services/book-genre-search.service';
import { ValidationService } from './services/validation.service';
import { ErrorHandlerService } from './services/error-handler.service';
import { UserContextService } from './services/user-context.service';
import { BookGenresController } from './controllers/book-genres.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookGenre]),
    AuditModule
  ],
  controllers: [BookGenresController],
  providers: [
    // Core Services
    BookGenreCrudService,
    BookGenreSearchService,
    ValidationService,
    ErrorHandlerService,
    UserContextService,
    BookGenreCrudRepository,
    BookGenreSearchRepository,
    
    // Interface Providers
    {
      provide: 'IBookGenreCrudService',
      useClass: BookGenreCrudService,
    },
    {
      provide: 'IBookGenreSearchService',
      useClass: BookGenreSearchService,
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
      provide: 'IBookGenreCrudRepository',
      useClass: BookGenreCrudRepository,
    },
    {
      provide: 'IBookGenreSearchRepository',
      useClass: BookGenreSearchRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    'IBookGenreCrudService',
    'IBookGenreSearchService',
  ],
})
export class BookGenresModule {}