import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class BookAuthorExactSearchDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['firstName', 'lastName', 'nationality'])
  @ApiProperty({
    description: 'Field to search exactly in',
    example: 'firstName',
    enum: ['firstName', 'lastName', 'nationality'],
    required: true,
  })
  searchField: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exact value to search for',
    example: 'Gabriel',
    required: true,
  })
  searchValue: string;
}
