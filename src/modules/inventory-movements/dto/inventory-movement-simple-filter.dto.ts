import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class InventoryMovementSimpleFilterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Search term to filter across multiple fields (notes, movementType, entityType)',
    example: 'libro',
    required: false,
  })
  term?: string;
}
