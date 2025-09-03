import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserFiltersDto } from './user-filters.dto';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class GetUsersByAdvancedFilterDto {
  @ApiProperty({
    description: 'Filtros avanzados para usuarios',
    type: UserFiltersDto,
  })
  @ValidateNested()
  @Type(() => UserFiltersDto)
  filters: UserFiltersDto;

  @ApiProperty({
    description: 'Configuración de paginación',
    type: PaginationInputDto,
  })
  @ValidateNested()
  @Type(() => PaginationInputDto)
  pagination: PaginationInputDto;
}
