import { IsOptional, IsString, Length } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MovementSearchDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  @ApiPropertyOptional({
    description: 'Término de búsqueda para buscar en notas, nombre de usuario, tipo de entidad',
    example: 'libro actualizado',
    minLength: 2,
    maxLength: 100,
  })
  searchTerm?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @ApiPropertyOptional({
    description: 'Buscar por nombre completo de usuario',
    example: 'Juan Pérez',
    maxLength: 100,
  })
  userFullName?: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  @ApiPropertyOptional({
    description: 'Buscar en notas del movimiento',
    example: 'venta exitosa',
    minLength: 2,
    maxLength: 200,
  })
  notes?: string;
}
