import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BookAuthorExactSearchDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Nombre del autor',
    example: 'Gabriel',
  })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Apellido del autor',
    example: 'García Márquez',
  })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Nacionalidad del autor',
    example: 'Colombiana',
  })
  nationality?: string;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Fecha de nacimiento del autor',
    example: '1927-03-06',
  })
  birthDate?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Biografía del autor',
    example: 'Escritor colombiano, premio Nobel de Literatura',
  })
  biography?: string;
}
