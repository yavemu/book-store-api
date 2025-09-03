import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AuditExactSearchDto } from './audit-exact-search.dto';

export class GetAuditsBySearchDto {
  @ApiProperty({
    description: 'Datos de búsqueda específica de auditorías',
    type: AuditExactSearchDto,
  })
  @ValidateNested()
  @Type(() => AuditExactSearchDto)
  @IsNotEmpty({ message: 'Los datos de búsqueda son requeridos' })
  searchData: AuditExactSearchDto;
}
