import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class AssignmentSimpleFilterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search term to filter across assignments (bookId, authorId)',
    example: 'book-123',
    required: false,
  })
  term?: string;
}
