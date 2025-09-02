import { IsString, IsOptional, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class AuditSimpleFilterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'Search term to filter across multiple fields (performedBy, entityId, details, entityType)',
    example: 'user123',
    required: false,
  })
  term?: string;
}
