import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class BookGenreSearchDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Search term to look for in genre name and description',
    example: 'fiction',
    required: true,
  })
  searchTerm: string;
}
