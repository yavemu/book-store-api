import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class AuditSimpleFilterDto extends PaginationInputDto {
  @IsString()
  @ApiProperty({
    description:
      'Search term to filter across multiple fields (performedBy, entityId, details, entityType)',
    example: 'user123',
    required: true,
  })
  term: string;
}
