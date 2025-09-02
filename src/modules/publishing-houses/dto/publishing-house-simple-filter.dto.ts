import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class PublishingHouseSimpleFilterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search term to filter across multiple fields (name, country, website)',
    example: 'penguin',
    required: false,
  })
  term?: string;
}
