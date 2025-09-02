import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class BookGenreSimpleFilterDto extends PaginationInputDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search term to filter across multiple fields (name, description)',
    example: 'fiction',
    required: false,
  })
  term?: string;
}
