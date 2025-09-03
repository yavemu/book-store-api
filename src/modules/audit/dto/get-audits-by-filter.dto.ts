import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationInputDto } from '../../../common/dto/pagination-input.dto';

export class GetAuditsByFilterDto {
  @ApiProperty({
    description: 'Término de búsqueda para filtrar auditorías',
    example: 'CREATE',
  })
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El término de búsqueda no puede estar vacío' })
  @MinLength(1, { message: 'El término debe tener al menos 1 carácter' })
  @IsOptional()
  term?: string;

  @ApiProperty({
    description: 'Configuración de paginación',
    type: PaginationInputDto,
  })
  @ValidateNested()
  @Type(() => PaginationInputDto)
  pagination: PaginationInputDto;
}
