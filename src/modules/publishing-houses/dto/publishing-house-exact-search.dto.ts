import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class PublishingHouseExactSearchDto extends PaginationInputDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['name', 'country'])
  @ApiProperty({
    description: 'Field to search exactly in',
    example: 'name',
    enum: ['name', 'country'],
    required: true,
  })
  searchField: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exact value to search for',
    example: 'Penguin Random House',
    required: true,
  })
  searchValue: string;
}
