import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class InventoryMovementSimpleFilterDto extends PaginationInputDto {
  @IsString()
  @ApiProperty({
    description: 'Search term to filter across multiple fields (notes, movementType, entityType)',
    example: 'libro',
    required: true,
  })
  term: string;
}
