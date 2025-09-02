import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class BookAuthorSimpleFilterDto extends PaginationInputDto {
  @IsString()
  @ApiProperty({
    description:
      'Search term to filter across multiple fields (firstName, lastName, nationality, biography)',
    example: 'García Márquez',
    required: true,
  })
  term: string;
}
