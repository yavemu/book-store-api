import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class UserSearchDto extends PaginationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Search term to look for in user email and names',
    example: 'john',
    required: true,
  })
  searchTerm: string;
}
