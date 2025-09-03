import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserExactSearchDto } from './user-exact-search.dto';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class GetUsersBySearchDto {
  @ApiProperty({
    description: 'Datos de búsqueda específica de usuarios',
    type: UserExactSearchDto,
  })
  @ValidateNested()
  @Type(() => UserExactSearchDto)
  @IsNotEmpty({ message: 'Los datos de búsqueda son requeridos' })
  searchData: UserExactSearchDto;

  @ApiProperty({
    description: 'Configuración de paginación',
    type: PaginationInputDto,
  })
  @ValidateNested()
  @Type(() => PaginationInputDto)
  pagination: PaginationInputDto;
}
