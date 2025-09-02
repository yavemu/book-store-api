import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class PublishingHouseSearchDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Search term to look for in publishing house name and country',
    example: 'penguin',
    required: true,
  })
  searchTerm: string;
}
