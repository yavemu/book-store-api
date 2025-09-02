import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class AuditExactSearchDto extends PaginationInputDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['performedBy', 'entityId', 'action', 'entityType', 'result'])
  @ApiProperty({
    description: 'Field to search exactly in',
    example: 'action',
    enum: ['performedBy', 'entityId', 'action', 'entityType', 'result'],
    required: true,
  })
  searchField: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exact value to search for',
    example: 'CREATE',
    required: true,
  })
  searchValue: string;
}
