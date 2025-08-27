import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCatalog } from './entities/book-catalog.entity';
import { BookCatalogController } from './book-catalog.controller';
import { BookCatalogService } from './services/book-catalog.service';
import { BookCatalogRepository } from './repositories/book-catalog.repository';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookCatalog]),
    AuditModule,
  ],
  controllers: [BookCatalogController],
  providers: [
    {
      provide: 'IBookCatalogService',
      useClass: BookCatalogService,
    },
    {
      provide: 'IBookCatalogRepository',
      useClass: BookCatalogRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    'IBookCatalogService',
    'IBookCatalogRepository',
  ],
})
export class BookCatalogModule {}