import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class PublishingHouseSimpleFilterDto extends PaginationInputDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search term to filter across multiple fields (name, country, website)',
    example: 'penguin',
    required: false,
  })
  term?: string;
}
