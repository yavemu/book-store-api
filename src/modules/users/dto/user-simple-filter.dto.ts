import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class UserSimpleFilterDto extends PaginationInputDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search term to filter across multiple fields (email, firstName, lastName)',
    example: 'john',
    required: false,
  })
  term?: string;
}
