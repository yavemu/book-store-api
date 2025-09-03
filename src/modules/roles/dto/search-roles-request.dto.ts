import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class SearchRolesRequestDto {
  @ApiProperty({
    description: 'Criterios de búsqueda para roles',
    example: { name: 'admin', description: 'administrator' },
  })
  @IsObject({ message: 'Los criterios de búsqueda deben ser un objeto' })
  searchCriteria: any;

  @ApiProperty({
    description: 'Configuración de paginación',
    type: PaginationInputDto,
  })
  @ValidateNested()
  @Type(() => PaginationInputDto)
  pagination: PaginationInputDto;
}
