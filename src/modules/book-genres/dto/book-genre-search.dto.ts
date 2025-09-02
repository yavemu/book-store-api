import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class BookGenreSearchDto extends PaginationInputDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Search term to look for in genre name and description',
    example: 'fiction',
    required: true,
  })
  searchTerm: string;
}
