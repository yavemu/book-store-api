import { PartialType } from '@nestjs/swagger';
import { CreateBookGenreDto } from './create-book-genre.dto';

export class UpdateBookGenreDto extends PartialType(CreateBookGenreDto) {}