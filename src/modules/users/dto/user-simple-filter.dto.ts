import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class UserSimpleFilterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search term to filter across multiple fields (email, firstName, lastName)',
    example: 'john',
    required: false,
  })
  term?: string;
}
