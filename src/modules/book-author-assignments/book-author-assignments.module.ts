import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookAuthorAssignment } from './entities/book-author-assignment.entity';
import { BookAuthorAssignmentsController } from './book-author-assignments.controller';
import { BookAuthorAssignmentService } from './services/book-author-assignment.service';
import { BookAuthorAssignmentRepository } from './repositories/book-author-assignment.repository';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookAuthorAssignment]),
    AuditModule,
  ],
  controllers: [BookAuthorAssignmentsController],
  providers: [
    {
      provide: 'IBookAuthorAssignmentService',
      useClass: BookAuthorAssignmentService,
    },
    {
      provide: 'IBookAuthorAssignmentRepository',
      useClass: BookAuthorAssignmentRepository,
    },
  ],
  exports: [
    TypeOrmModule,
    'IBookAuthorAssignmentService',
    'IBookAuthorAssignmentRepository',
  ],
})
export class BookAuthorAssignmentsModule {}