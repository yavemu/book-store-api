import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class AssignmentExactSearchDto extends PaginationInputDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['bookId', 'authorId'])
  @ApiProperty({
    description: 'Field to search exactly in',
    example: 'bookId',
    enum: ['bookId', 'authorId'],
    required: true,
  })
  searchField: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exact value to search for',
    example: 'book-123',
    required: true,
  })
  searchValue: string;
}
