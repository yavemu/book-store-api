import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class GetAllAuditsDto {
  @ApiProperty({
    description: 'Configuración de paginación',
    type: PaginationInputDto,
  })
  @ValidateNested()
  @Type(() => PaginationInputDto)
  pagination: PaginationInputDto;
}
