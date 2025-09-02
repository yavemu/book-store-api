import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class BookAuthorSimpleFilterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'Search term to filter across multiple fields (firstName, lastName, nationality, biography)',
    example: 'García Márquez',
    required: false,
  })
  term?: string;
}
