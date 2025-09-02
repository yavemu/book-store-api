import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class InventoryMovementExactSearchDto extends PaginationInputDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['movementType', 'userId', 'entityType'])
  @ApiProperty({
    description: 'Field to search exactly in',
    example: 'movementType',
    enum: ['movementType', 'userId', 'entityType'],
    required: true,
  })
  searchField: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exact value to search for',
    example: 'IN',
    required: true,
  })
  searchValue: string;
}
