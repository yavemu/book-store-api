import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class AuditExactSearchDto extends PaginationDto {
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
