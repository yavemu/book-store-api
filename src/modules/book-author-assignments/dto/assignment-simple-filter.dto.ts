import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class AssignmentSimpleFilterDto extends PaginationInputDto {
  @IsString()
  @ApiProperty({
    description: 'Search term to filter across assignments (bookId, authorId)',
    example: 'book-123',
    required: true,
  })
  term: string;
}
