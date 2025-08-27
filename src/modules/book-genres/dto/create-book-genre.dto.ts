import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookGenreDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @ApiProperty({ 
    description: 'Name of the book genre',
    example: 'Science Fiction',
    minLength: 2,
    maxLength: 50
  })
  genreName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ 
    description: 'Detailed description of the book genre',
    example: 'Fiction that deals with futuristic concepts, advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.'
  })
  genreDescription?: string;
}