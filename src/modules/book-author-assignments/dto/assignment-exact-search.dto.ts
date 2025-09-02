import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class AssignmentExactSearchDto extends PaginationDto {
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
