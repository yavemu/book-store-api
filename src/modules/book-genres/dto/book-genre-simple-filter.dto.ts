import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class BookGenreSimpleFilterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search term to filter across multiple fields (name, description)',
    example: 'fiction',
    required: false,
  })
  term?: string;
}
