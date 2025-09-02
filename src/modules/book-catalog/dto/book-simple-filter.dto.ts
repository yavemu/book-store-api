import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class BookSimpleFilterDto extends PaginationInputDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Filter term must be at least 3 characters long' })
  @ApiPropertyOptional({
    description: 'Partial search term to filter across multiple book fields (title, ISBN, summary)',
    example: 'Harry',
    minLength: 3,
    required: false,
  })
  term?: string;
}
