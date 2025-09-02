import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class PublishingHouseSearchDto extends PaginationInputDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Search term to look for in publishing house name and country',
    example: 'penguin',
    required: true,
  })
  searchTerm: string;
}
