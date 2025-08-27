import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookGenre } from './entities/book-genre.entity';
import { BookGenreRepository } from './repositories/book-genre.repository';
import { BookGenreService } from './services/book-genre.service';
import { BookGenresController } from './book-genres.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookGenre]),
    AuditModule
  ],
  controllers: [BookGenresController],
  providers: [
    BookGenreService,
    {
      provide: 'IBookGenreRepository',
      useClass: BookGenreRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    'IBookGenreRepository',
    BookGenreService,
  ],
})
export class BookGenresModule {}