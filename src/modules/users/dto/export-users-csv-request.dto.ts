import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserCsvExportFiltersDto } from './user-csv-export-filters.dto';

export class ExportUsersCsvRequestDto {
  @ApiProperty({
    description: 'Filtros para exportación CSV de usuarios',
    type: UserCsvExportFiltersDto,
  })
  @ValidateNested()
  @Type(() => UserCsvExportFiltersDto)
  filters: UserCsvExportFiltersDto;
}
