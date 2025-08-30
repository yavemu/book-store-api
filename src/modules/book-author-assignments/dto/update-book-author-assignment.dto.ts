import { PartialType } from '@nestjs/swagger';
import { CreateBookAuthorAssignmentDto } from './create-book-author-assignment.dto';

export class UpdateBookAuthorAssignmentDto extends PartialType(CreateBookAuthorAssignmentDto) {}
