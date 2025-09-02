import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class InventoryMovementExactSearchDto extends PaginationDto {
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
