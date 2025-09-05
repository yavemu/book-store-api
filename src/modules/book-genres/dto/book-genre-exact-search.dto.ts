import { IsString, IsOptional, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BookGenreExactSearchDto {
  @IsString()
  @IsOptional()
  @Length(2, 50)
  @ApiPropertyOptional({
    description: 'Name of the book genre',
    example: 'Science Fiction',
    minLength: 2,
    maxLength: 50,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Detailed description of the book genre',
    example:
      'Fiction that deals with futuristic concepts, advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.',
    required: false,
  })
  description?: string;
}
