import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class PublishingHouseExactSearchDto extends PaginationDto {
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
