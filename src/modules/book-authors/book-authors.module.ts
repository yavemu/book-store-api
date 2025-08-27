import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookAuthor } from './entities/book-author.entity';
import { BookAuthorsController } from './book-authors.controller';
import { BookAuthorService } from './services/book-author.service';
import { BookAuthorRepository } from './repositories/book-author.repository';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookAuthor]),
    AuditModule,
  ],
  controllers: [BookAuthorsController],
  providers: [
    {
      provide: 'IBookAuthorService',
      useClass: BookAuthorService,
    },
    {
      provide: 'IBookAuthorRepository',
      useClass: BookAuthorRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    'IBookAuthorService',
    'IBookAuthorRepository',
  ],
})
export class BookAuthorsModule {}