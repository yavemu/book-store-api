import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class BookExactSearchDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['title', 'isbnCode', 'author', 'genre', 'publisher'])
  @ApiProperty({
    description: 'Field to search exactly in',
    example: 'title',
    enum: ['title', 'isbnCode', 'author', 'genre', 'publisher'],
    required: true,
  })
  searchField: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exact value to search for',
    example: 'The Great Gatsby',
    required: true,
  })
  searchValue: string;
}
