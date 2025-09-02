import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class BookGenreExactSearchDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['name'])
  @ApiProperty({
    description: 'Field to search exactly in',
    example: 'name',
    enum: ['name'],
    required: true,
  })
  searchField: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exact value to search for',
    example: 'Fiction',
    required: true,
  })
  searchValue: string;
}
