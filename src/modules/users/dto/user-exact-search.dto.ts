import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class UserExactSearchDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['email', 'firstName', 'lastName'])
  @ApiProperty({
    description: 'Field to search exactly in',
    example: 'email',
    enum: ['email', 'firstName', 'lastName'],
    required: true,
  })
  searchField: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exact value to search for',
    example: 'admin@bookstore.com',
    required: true,
  })
  searchValue: string;
}
